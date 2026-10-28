// Recognises what kind of project a folder holds (native iOS, Flutter, React Native or Expo),
// where its iOS app project is, and the versions that decide which fix applies.
import { readdir, realpath, stat } from 'node:fs/promises';
import { basename, dirname, join, resolve, sep } from 'node:path';
import { readProjectText } from '../core/files.js';
import { lowestAllowed } from '../core/versions.js';

export type Ecosystem = 'native' | 'flutter' | 'react-native' | 'expo';

export interface PackageVersion {
  name: string;
  /** Exact version when installed or locked, otherwise the lowest the declared range allows. */
  version: string | null;
  /** Where `version` came from. */
  source: 'installed' | 'lockfile' | 'declared';
  /** The range in package.json. */
  declared: string;
}

export interface FlutterInfo {
  /** From .fvmrc or .fvm/fvm_config.json; null when the project does not pin one. */
  version: string | null;
  /** pubspec.yaml sets `enable-uiscene-migration: false`. */
  migrationDisabled: boolean;
  plugin: boolean;
}

export interface ExpoConfig {
  /** app.json (read) or app.config.js/ts (not evaluated). */
  file: string;
  /** expo-build-properties `ios.enableSceneSupport`; null when the config cannot be read. */
  enableSceneSupport: boolean | null;
}

export interface Project {
  root: string;
  name: string;
  ecosystem: Ecosystem;
  /** The folder with the iOS app's Xcode project; null for an Expo app without ios/. */
  iosDir: string | null;
  /** Absolute paths of the .xcodeproj folders of the app. */
  xcodeProjects: string[];
  /** npm packages that decide the fix (react-native, expo, workarounds), when present. */
  packages: ReadonlyMap<string, PackageVersion>;
  flutter: FlutterInfo | null;
  expoConfig: ExpoConfig | null;
}

export class ProjectError extends Error {
  override name = 'ProjectError';
}

/** npm packages whose version or presence changes the advice. */
export const WATCHED_PACKAGES = [
  'react-native',
  'expo',
  'expo-build-properties',
  'react-native-uiscene-bridge',
  'react-native-xcode27',
] as const;

const SKIPPED_FOLDERS = new Set([
  'Pods',
  'node_modules',
  'build',
  'DerivedData',
  '.build',
  'Carthage',
  '.git',
  '.symlinks',
]);

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

/** Parses `path` read with readProjectText; undefined when it is not read or is not JSON. */
async function readJson(path: string, root: string | null): Promise<unknown> {
  const text = await readProjectText(path, root);
  if (text === null) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

/**
 * node_modules/<name>/package.json. pnpm, Yarn and workspaces link installed packages from outside
 * the app folder, so the file may be anywhere; it is read only when its real path is a
 * package.json in a node_modules/<name> folder. A link to any other file would put a field of that
 * file, which the user did not ask to check, into the report.
 */
async function installedManifest(root: string, name: string): Promise<unknown> {
  const real = await realpath(join(root, 'node_modules', name, 'package.json')).catch(() => null);
  if (real === null) return undefined;
  const tail = ['node_modules', ...name.split('/'), 'package.json'];
  if (real.split(sep).slice(-tail.length).join('/') !== tail.join('/')) return undefined;
  return readJson(real, null);
}

const record = (value: unknown): Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

async function xcodeProjectsIn(folder: string): Promise<string[]> {
  try {
    const entries = await readdir(folder, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory() && entry.name.endsWith('.xcodeproj'))
      .map((entry) => join(folder, entry.name))
      .sort();
  } catch {
    return [];
  }
}

/** Native apps keep the .xcodeproj at the root or one folder down (App/App.xcodeproj). */
async function nativeXcodeProjects(root: string): Promise<string[]> {
  const top = await xcodeProjectsIn(root);
  if (top.length > 0) return top;
  const entries = await readdir(root, { withFileTypes: true }).catch(() => []);
  const nested = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory() && !SKIPPED_FOLDERS.has(entry.name))
      .map((entry) => xcodeProjectsIn(join(root, entry.name))),
  );
  return nested.flat().sort();
}

async function packageVersions(
  root: string,
  manifest: Record<string, unknown>,
): Promise<Map<string, PackageVersion>> {
  const declared = {
    ...record(manifest.devDependencies),
    ...record(manifest.dependencies),
  };
  const lock = record(record(await readJson(join(root, 'package-lock.json'), root)).packages);
  const result = new Map<string, PackageVersion>();
  for (const name of WATCHED_PACKAGES) {
    const range = declared[name];
    if (typeof range !== 'string') continue;
    const installed = record(await installedManifest(root, name));
    const locked = record(lock[`node_modules/${name}`]);
    if (typeof installed.version === 'string') {
      result.set(name, {
        name,
        version: installed.version,
        source: 'installed',
        declared: range,
      });
    } else if (typeof locked.version === 'string') {
      result.set(name, {
        name,
        version: locked.version,
        source: 'lockfile',
        declared: range,
      });
    } else {
      result.set(name, {
        name,
        version: lowestAllowed(range),
        source: 'declared',
        declared: range,
      });
    }
  }
  return result;
}

function sceneSupportIn(plugins: unknown): boolean {
  if (!Array.isArray(plugins)) return false;
  return plugins.some((plugin) => {
    if (!Array.isArray(plugin) || plugin[0] !== 'expo-build-properties') return false;
    return record(record(plugin[1]).ios).enableSceneSupport === true;
  });
}

async function expoConfig(root: string): Promise<ExpoConfig | null> {
  for (const file of ['app.config.ts', 'app.config.js', 'app.config.mjs', 'app.config.cjs']) {
    if (await exists(join(root, file))) return { file, enableSceneSupport: null };
  }
  const json = await readJson(join(root, 'app.json'), root);
  if (json === undefined) return null;
  const config = record(json);
  const expo = 'expo' in config ? record(config.expo) : config;
  return { file: 'app.json', enableSceneSupport: sceneSupportIn(expo.plugins) };
}

async function flutterInfo(root: string, pubspec: string): Promise<FlutterInfo> {
  const fvmrc = record(await readJson(join(root, '.fvmrc'), root));
  const fvmConfig = record(await readJson(join(root, '.fvm', 'fvm_config.json'), root));
  const pinned = fvmrc.flutter ?? fvmConfig.flutterSdkVersion;
  return {
    version: typeof pinned === 'string' ? pinned : null,
    migrationDisabled: /^\s+enable-uiscene-migration:\s*false\b/m.test(pubspec),
    plugin: /^flutter:\s*\n(?:\s.*\n)*?\s+plugin:/m.test(pubspec),
  };
}

/**
 * Detects the project at `path`: a project folder, or an .xcodeproj folder for a native app.
 * Throws ProjectError when there is nothing iOS to check.
 */
export async function detectProject(path: string): Promise<Project> {
  const target = resolve(path);
  const info = await stat(target).catch(() => null);
  if (!info) throw new ProjectError(`${path} does not exist.`);
  if (info.isDirectory() && target.endsWith('.xcodeproj')) {
    return nativeProject(dirname(target), [target]);
  }
  if (!info.isDirectory()) throw new ProjectError(`${path} is not a folder.`);

  const pubspec = await readProjectText(join(target, 'pubspec.yaml'), target);
  if (pubspec !== null && /^\s+sdk:\s*flutter\b|^flutter:/m.test(pubspec)) {
    const flutter = await flutterInfo(target, pubspec);
    const iosDir = join(target, flutter.plugin ? join('example', 'ios') : 'ios');
    const xcodeProjects = await xcodeProjectsIn(iosDir);
    if (xcodeProjects.length === 0) {
      throw new ProjectError(`${path} is a Flutter project without an iOS app (no ${iosDir}).`);
    }
    const name = /^name:\s*([\w-]+)/m.exec(pubspec)?.[1] ?? basename(target);
    return {
      root: target,
      name,
      ecosystem: 'flutter',
      iosDir,
      xcodeProjects,
      packages: new Map(),
      flutter,
      expoConfig: null,
    };
  }

  const manifest = record(await readJson(join(target, 'package.json'), target));
  const packages = await packageVersions(target, manifest);
  if (packages.has('expo') || packages.has('react-native')) {
    const ecosystem = packages.has('expo') ? 'expo' : 'react-native';
    const iosDir = join(target, 'ios');
    const xcodeProjects = await xcodeProjectsIn(iosDir);
    if (xcodeProjects.length === 0 && ecosystem === 'react-native') {
      throw new ProjectError(`${path} is a React Native project without ios/.`);
    }
    return {
      root: target,
      name: typeof manifest.name === 'string' ? manifest.name : basename(target),
      ecosystem,
      iosDir: xcodeProjects.length > 0 ? iosDir : null,
      xcodeProjects,
      packages,
      flutter: null,
      expoConfig: ecosystem === 'expo' ? await expoConfig(target) : null,
    };
  }

  const xcodeProjects = await nativeXcodeProjects(target);
  if (xcodeProjects.length === 0) {
    throw new ProjectError(
      `No iOS project found in ${path}: expected an .xcodeproj, a Flutter pubspec.yaml or a React Native or Expo package.json.`,
    );
  }
  return nativeProject(target, xcodeProjects);
}

function nativeProject(root: string, xcodeProjects: string[]): Project {
  const first = xcodeProjects[0] ?? root;
  return {
    root,
    name: basename(first).replace(/\.xcodeproj$/, ''),
    ecosystem: 'native',
    iosDir: dirname(first),
    xcodeProjects,
    packages: new Map(),
    flutter: null,
    expoConfig: null,
  };
}
