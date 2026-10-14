// Everything the rules look at for one project: its iOS app targets with their Info.plist, and
// the index of the app's own Swift and Objective-C sources.
import { join } from 'node:path';
import { NOT_READ, readProjectFile } from '../core/files.js';
import type { Project } from '../detect/project.js';
import type { InfoPlistSource } from '../model.js';
import {
  generatesInfoPlist,
  infoPlistFiles,
  iosAppTargets,
  readXcodeProject,
  type XcodeProject,
  type XcodeTarget,
} from './pbxproj.js';
import { isDict, type PlistDict, parsePlist } from './plist.js';
import { indexSources, type SourceIndex } from './sources.js';

export interface InfoPlistFile {
  path: string;
  dict: PlistDict;
  keyLines: ReadonlyMap<string, number>;
}

export interface AppTarget {
  name: string;
  /** The .xcodeproj the target belongs to. */
  xcodeProject: string;
  infoPlists: InfoPlistFile[];
  /** Xcode generates (part of) the Info.plist: GENERATE_INFOPLIST_FILE = YES. */
  generatesInfoPlist: boolean;
  /**
   * Where the rules get the Info.plist from: a file sdkbump read, the one Xcode generates from
   * build settings, or none (not-read) when the file could not be read or the project file does
   * not say which one it is.
   */
  infoPlistSource: InfoPlistSource;
}

export interface AppModel {
  project: Project;
  targets: AppTarget[];
  sources: SourceIndex;
  /** Problems reading the project that the report should mention. */
  notes: string[];
}

/**
 * Reads the Info.plist a target names. INFOPLIST_FILE comes from the checked project, so a path
 * that leads (through `..`, an absolute path or a symbolic link) outside the project folder is
 * not read, and neither is anything but a regular file: /dev/zero would never end.
 */
async function readInfoPlist(
  path: string,
  projectRoot: string,
  notes: string[],
): Promise<InfoPlistFile | null> {
  const file = await readProjectFile(path, projectRoot);
  if (!file.found) {
    notes.push(`${path} is named in INFOPLIST_FILE but ${NOT_READ[file.reason]}`);
    return null;
  }
  try {
    const { value, keyLines } = parsePlist(file.bytes);
    if (!isDict(value)) throw new Error('the top level is not a dictionary');
    return { path, dict: value, keyLines };
  } catch (error) {
    notes.push(`${path} could not be read as a property list: ${(error as Error).message}`);
    return null;
  }
}

/**
 * Reads one app target's Info.plist. A target that names no INFOPLIST_FILE and does not have
 * Xcode generate one most likely sets it in an .xcconfig file, which sdkbump does not read.
 */
async function readTarget(
  xcode: XcodeProject,
  target: XcodeTarget,
  projectRoot: string,
  notes: string[],
): Promise<AppTarget> {
  const { files, unresolved } = infoPlistFiles(xcode, target);
  for (const raw of unresolved) {
    notes.push(
      `${target.name}: INFOPLIST_FILE ${raw} uses a build setting sdkbump does not expand.`,
    );
  }
  const infoPlists: InfoPlistFile[] = [];
  for (const file of files) {
    const plist = await readInfoPlist(file, projectRoot, notes);
    if (plist) infoPlists.push(plist);
  }
  const generates = generatesInfoPlist(target);
  const named = files.length + unresolved.length > 0;
  if (!named && !generates) {
    notes.push(
      `${target.name}: the Xcode project sets neither INFOPLIST_FILE nor GENERATE_INFOPLIST_FILE = YES; they may be set in an .xcconfig file, which sdkbump does not read.`,
    );
  }
  let infoPlistSource: InfoPlistSource = 'not-read';
  if (infoPlists.length > 0) infoPlistSource = 'file';
  else if (!named && generates) infoPlistSource = 'generated';
  return {
    name: target.name,
    xcodeProject: xcode.path,
    infoPlists,
    generatesInfoPlist: generates,
    infoPlistSource,
  };
}

/** Reads the app targets and sources of a detected project. */
export async function collectApp(project: Project): Promise<AppModel> {
  const notes: string[] = [];
  const targets: AppTarget[] = [];
  for (const path of project.xcodeProjects) {
    let xcode: XcodeProject;
    try {
      xcode = await readXcodeProject(path, project.root);
    } catch (error) {
      notes.push(`${path}: ${(error as Error).message}`);
      continue;
    }
    for (const target of iosAppTargets(xcode)) {
      targets.push(await readTarget(xcode, target, project.root, notes));
    }
  }
  if (project.iosDir && project.xcodeProjects.length > 0 && targets.length === 0) {
    notes.push('No iOS app target was found in the Xcode project.');
  }
  const sources = await indexSources(project.iosDir ? [project.iosDir] : []);
  return { project, targets, sources, notes };
}

/** The scene manifest of an Info.plist and whether it lists at least one configuration. */
export function sceneManifest(plist: InfoPlistFile): { present: boolean; configured: boolean } {
  const manifest = plist.dict.UIApplicationSceneManifest;
  if (!isDict(manifest)) return { present: false, configured: false };
  const configurations = manifest.UISceneConfigurations;
  const configured =
    isDict(configurations) &&
    Object.values(configurations).some((roles) => Array.isArray(roles) && roles.length > 0);
  return { present: true, configured };
}

/** Path of the Flutter Runner's AppDelegate files, for the auto-migration check. */
export const flutterAppDelegatePaths = (iosDir: string) => ({
  swift: join(iosDir, 'Runner', 'AppDelegate.swift'),
  objcHeader: join(iosDir, 'Runner', 'AppDelegate.h'),
  objcImplementation: join(iosDir, 'Runner', 'AppDelegate.m'),
});

/**
 * The scene delegate classes an Info.plist names in its scene configurations, without a module
 * prefix: "$(PRODUCT_MODULE_NAME).SceneDelegate" and "App.SceneDelegate" both give "SceneDelegate".
 */
export function sceneDelegateClassNames(plist: InfoPlistFile): string[] {
  const configurations = (plist.dict.UIApplicationSceneManifest as PlistDict | undefined)
    ?.UISceneConfigurations;
  if (!isDict(configurations)) return [];
  return Object.values(configurations)
    .flatMap((roles) => (Array.isArray(roles) ? roles : []))
    .map((entry) => (isDict(entry) ? entry.UISceneDelegateClassName : undefined))
    .filter((name): name is string => typeof name === 'string')
    .map((name) => name.split('.').at(-1) ?? name);
}
