// Reads the app targets of an Xcode project from project.pbxproj (an old-style "OpenStep"
// property list): their names, product types and the build settings that decide which Info.plist
// they use and which platform they build for.
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

export type OpenStepValue = string | OpenStepValue[] | OpenStepDict;
export interface OpenStepDict {
  [key: string]: OpenStepValue;
}

export class XcodeProjectError extends Error {
  override name = 'XcodeProjectError';
}

/** Parses an old-style property list such as project.pbxproj. */
export function parseOpenStep(text: string): OpenStepValue {
  let index = 0;

  const fail = (message: string): never => {
    const line = text.slice(0, index).split('\n').length;
    throw new XcodeProjectError(`${message} (line ${line})`);
  };

  const skip = () => {
    for (;;) {
      const char = text[index];
      if (char === undefined) return;
      if (/\s/.test(char)) index++;
      else if (text.startsWith('//', index)) {
        const end = text.indexOf('\n', index);
        index = end === -1 ? text.length : end + 1;
      } else if (text.startsWith('/*', index)) {
        const end = text.indexOf('*/', index + 2);
        if (end === -1) fail('Unclosed comment');
        index = end + 2;
      } else return;
    }
  };

  const quoted = (): string => {
    index++;
    let result = '';
    for (;;) {
      const char = text[index++];
      if (char === undefined) fail('Unclosed string');
      if (char === '"') return result;
      if (char !== '\\') {
        result += char;
        continue;
      }
      const escaped = text[index++];
      if (escaped === 'n') result += '\n';
      else if (escaped === 't') result += '\t';
      else if (escaped === 'r') result += '\r';
      else if (escaped === 'U' || escaped === 'u') {
        const hex = text.slice(index, index + 4);
        if (!/^[0-9a-fA-F]{4}$/.test(hex)) fail('Bad unicode escape');
        result += String.fromCharCode(Number.parseInt(hex, 16));
        index += 4;
      } else if (escaped !== undefined) result += escaped;
    }
  };

  const bare = (): string => {
    const match = /^[A-Za-z0-9_$+./:-]+/.exec(text.slice(index, index + 4096));
    if (!match) return fail(`Unexpected character "${text[index] ?? 'end of file'}"`);
    index += match[0].length;
    return match[0];
  };

  const value = (): OpenStepValue => {
    skip();
    const char = text[index];
    if (char === '{') {
      index++;
      const dict: OpenStepDict = {};
      for (;;) {
        skip();
        if (text[index] === '}') {
          index++;
          return dict;
        }
        const key = text[index] === '"' ? quoted() : bare();
        skip();
        if (text[index] !== '=') fail('Expected "="');
        index++;
        dict[key] = value();
        skip();
        if (text[index] !== ';') fail('Expected ";"');
        index++;
      }
    }
    if (char === '(') {
      index++;
      const array: OpenStepValue[] = [];
      for (;;) {
        skip();
        if (text[index] === ')') {
          index++;
          return array;
        }
        array.push(value());
        skip();
        if (text[index] === ',') index++;
        else if (text[index] !== ')') fail('Expected "," or ")"');
      }
    }
    if (char === '"') return quoted();
    if (char === '<') {
      const end = text.indexOf('>', index);
      if (end === -1) fail('Unclosed data');
      const data = text.slice(index + 1, end).replace(/\s+/g, '');
      index = end + 1;
      return data;
    }
    return bare();
  };

  const result = value();
  skip();
  if (index < text.length) fail('Unexpected text after the property list');
  return result;
}

export type BuildSettings = Readonly<Record<string, string | readonly string[]>>;

export interface XcodeTarget {
  name: string;
  productType: string;
  /** Build settings per configuration (Debug, Release, …), project-level values included. */
  configurations: Readonly<Record<string, BuildSettings>>;
}

export interface XcodeProject {
  /** Path of the .xcodeproj folder. */
  path: string;
  /** The folder that contains the .xcodeproj, which $(SRCROOT) refers to. */
  sourceRoot: string;
  targets: XcodeTarget[];
}

const asDict = (value: OpenStepValue | undefined): OpenStepDict | undefined =>
  typeof value === 'object' && !Array.isArray(value) ? value : undefined;
const asString = (value: OpenStepValue | undefined): string | undefined =>
  typeof value === 'string' ? value : undefined;
const asArray = (value: OpenStepValue | undefined): OpenStepValue[] =>
  Array.isArray(value) ? value : [];

function settingsOf(dict: OpenStepDict | undefined): Record<string, string | string[]> {
  const result: Record<string, string | string[]> = {};
  for (const [key, value] of Object.entries(dict ?? {})) {
    if (typeof value === 'string') result[key] = value;
    else if (Array.isArray(value)) result[key] = value.filter((item) => typeof item === 'string');
  }
  return result;
}

function configurationsOf(
  objects: OpenStepDict,
  listId: string | undefined,
): Map<string, Record<string, string | string[]>> {
  const result = new Map<string, Record<string, string | string[]>>();
  const list = asDict(objects[listId ?? '']);
  for (const id of asArray(list?.buildConfigurations)) {
    const configuration = asDict(objects[asString(id) ?? '']);
    const name = asString(configuration?.name);
    if (configuration && name) result.set(name, settingsOf(asDict(configuration.buildSettings)));
  }
  return result;
}

/** Reads the native targets of a parsed project.pbxproj. */
export function readTargets(pbxproj: OpenStepValue): XcodeTarget[] {
  const objects = asDict(asDict(pbxproj)?.objects);
  const rootId = asString(asDict(pbxproj)?.rootObject);
  if (!objects || !rootId) throw new XcodeProjectError('project.pbxproj has no objects.');
  const project = asDict(objects[rootId]);
  if (!project) throw new XcodeProjectError('project.pbxproj has no root object.');
  const projectConfigurations = configurationsOf(objects, asString(project.buildConfigurationList));

  const targets: XcodeTarget[] = [];
  for (const id of asArray(project.targets)) {
    const target = asDict(objects[asString(id) ?? '']);
    if (asString(target?.isa) !== 'PBXNativeTarget' || !target) continue;
    const configurations: Record<string, BuildSettings> = {};
    for (const [name, settings] of configurationsOf(
      objects,
      asString(target.buildConfigurationList),
    )) {
      configurations[name] = { ...projectConfigurations.get(name), ...settings };
    }
    targets.push({
      name: asString(target.name) ?? asString(target.productName) ?? 'unnamed',
      productType: asString(target.productType) ?? '',
      configurations,
    });
  }
  return targets;
}

/** Reads `<path>.xcodeproj/project.pbxproj`. */
export async function readXcodeProject(path: string): Promise<XcodeProject> {
  const file = join(path, 'project.pbxproj');
  let text: string;
  try {
    text = await readFile(file, 'utf8');
  } catch {
    throw new XcodeProjectError(`${file} cannot be read.`);
  }
  return { path, sourceRoot: dirname(resolve(path)), targets: readTargets(parseOpenStep(text)) };
}

const APP_PRODUCT_TYPES = new Set([
  'com.apple.product-type.application',
  'com.apple.product-type.application.on-demand-install-capable', // App Clip
]);

const setting = (settings: BuildSettings, key: string): string | undefined => {
  const value = settings[key];
  return typeof value === 'string' ? value : value?.join(' ');
};

/** Whether the target builds with the iOS SDK (SDKROOT iphoneos, or `auto` listing iphoneos). */
export function buildsForIOS(settings: BuildSettings): boolean {
  const sdk = setting(settings, 'SDKROOT');
  if (sdk === undefined) return false;
  if (sdk.startsWith('iphoneos')) return true;
  if (sdk === 'auto') return /\biphoneos\b/.test(setting(settings, 'SUPPORTED_PLATFORMS') ?? '');
  return false;
}

/** iOS app targets (apps and App Clips): the ones UIKit's launch check applies to. */
export function iosAppTargets(project: XcodeProject): XcodeTarget[] {
  return project.targets.filter(
    (target) =>
      APP_PRODUCT_TYPES.has(target.productType) &&
      Object.values(target.configurations).some(buildsForIOS),
  );
}

const VARIABLE = /\$\(([A-Za-z0-9_]+)\)|\$\{([A-Za-z0-9_]+)\}/g;

/**
 * The Info.plist files a target's configurations name in INFOPLIST_FILE, as absolute paths.
 * $(SRCROOT), $(PROJECT_DIR), $(TARGET_NAME) and $(PRODUCT_NAME) are expanded; a path that still
 * contains an unknown variable is returned in `unresolved`.
 */
export function infoPlistFiles(
  project: XcodeProject,
  target: XcodeTarget,
): { files: string[]; unresolved: string[] } {
  const files = new Set<string>();
  const unresolved = new Set<string>();
  for (const settings of Object.values(target.configurations)) {
    const raw = setting(settings, 'INFOPLIST_FILE');
    if (!raw) continue;
    const known: Record<string, string> = {
      SRCROOT: project.sourceRoot,
      PROJECT_DIR: project.sourceRoot,
      TARGET_NAME: target.name,
      PRODUCT_NAME:
        setting(settings, 'PRODUCT_NAME')?.replace(VARIABLE, target.name) ?? target.name,
    };
    let missing = false;
    const expanded = raw.replace(VARIABLE, (whole, round?: string, curly?: string) => {
      const value = known[round ?? curly ?? ''];
      if (value === undefined) missing = true;
      return value ?? whole;
    });
    if (missing) unresolved.add(raw);
    else files.add(resolve(project.sourceRoot, expanded));
  }
  return { files: [...files], unresolved: [...unresolved] };
}

/** Whether every configuration of the target has Xcode generate (part of) its Info.plist. */
export function generatesInfoPlist(target: XcodeTarget): boolean {
  const values = Object.values(target.configurations);
  return (
    values.length > 0 &&
    values.every((settings) => setting(settings, 'GENERATE_INFOPLIST_FILE') === 'YES')
  );
}
