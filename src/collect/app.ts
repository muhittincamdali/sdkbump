// Everything the rules look at for one project: its iOS app targets with their Info.plist, and
// the index of the app's own Swift and Objective-C sources.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Project } from '../detect/project.js';
import { generatesInfoPlist, infoPlistFiles, iosAppTargets, readXcodeProject } from './pbxproj.js';
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
}

export interface AppModel {
  project: Project;
  targets: AppTarget[];
  sources: SourceIndex;
  /** Problems reading the project that the report should mention. */
  notes: string[];
}

async function readInfoPlist(path: string, notes: string[]): Promise<InfoPlistFile | null> {
  let bytes: Uint8Array;
  try {
    bytes = await readFile(path);
  } catch {
    notes.push(`${path} is named in INFOPLIST_FILE but does not exist.`);
    return null;
  }
  try {
    const { value, keyLines } = parsePlist(bytes);
    if (!isDict(value)) throw new Error('the top level is not a dictionary');
    return { path, dict: value, keyLines };
  } catch (error) {
    notes.push(`${path} could not be read as a property list: ${(error as Error).message}`);
    return null;
  }
}

/** Reads the app targets and sources of a detected project. */
export async function collectApp(project: Project): Promise<AppModel> {
  const notes: string[] = [];
  const targets: AppTarget[] = [];
  for (const path of project.xcodeProjects) {
    let xcode: Awaited<ReturnType<typeof readXcodeProject>>;
    try {
      xcode = await readXcodeProject(path);
    } catch (error) {
      notes.push(`${path}: ${(error as Error).message}`);
      continue;
    }
    for (const target of iosAppTargets(xcode)) {
      const { files, unresolved } = infoPlistFiles(xcode, target);
      for (const raw of unresolved) {
        notes.push(
          `${target.name}: INFOPLIST_FILE ${raw} uses a build setting sdkbump does not expand.`,
        );
      }
      const infoPlists: InfoPlistFile[] = [];
      for (const file of files) {
        const plist = await readInfoPlist(file, notes);
        if (plist) infoPlists.push(plist);
      }
      targets.push({
        name: target.name,
        xcodeProject: path,
        infoPlists,
        generatesInfoPlist: generatesInfoPlist(target),
      });
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
