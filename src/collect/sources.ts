// Swift and Objective-C sources of an app: comments and string literals blanked out (so a pattern
// never matches inside them), the classes, structs and extensions they declare, and which of
// those are app delegates, scene delegates or a SwiftUI App.
import { readdir, realpath } from 'node:fs/promises';
import { extname, join, relative, sep } from 'node:path';
import { isInside, readProjectFile } from '../core/files.js';
import { lineIndex } from '../core/lines.js';
import { blankCommentsAndStrings } from './blank.js';
import { derivedFrom, objcRegions, swiftRegions } from './regions.js';

export { blankCommentsAndStrings } from './blank.js';
export { insideTypeNamed, regionAt } from './regions.js';

export type Language = 'swift' | 'objc';

export interface SourceFile {
  path: string;
  language: Language;
  /** The file as written. */
  text: string;
  /** The same text with comments and string contents replaced by spaces; offsets and lines match. */
  code: string;
  /** 1-based line of an offset. */
  lineAt(offset: number): number;
}

export interface TypeRegion {
  file: SourceFile;
  kind: 'class' | 'struct' | 'enum' | 'actor' | 'extension' | 'interface' | 'implementation';
  name: string;
  /** Superclass and protocols as written, without module prefixes or generic arguments. */
  inherits: string[];
  /** Offsets of the body: from `{` (or the declaration for Objective-C) to its end. */
  start: number;
  end: number;
  line: number;
  /** Swift: the declaration carries `@main` or `@UIApplicationMain`. */
  main: boolean;
}

export interface SourceIndex {
  files: SourceFile[];
  regions: TypeRegion[];
  appDelegates: ReadonlySet<string>;
  sceneDelegates: ReadonlySet<string>;
  /** Structs that conform to SwiftUI's App. */
  swiftUIApps: TypeRegion[];
}

/** Superclasses and protocols that make a class an app delegate. */
export const APP_DELEGATE_BASES = [
  'UIApplicationDelegate',
  'FlutterAppDelegate',
  'ExpoAppDelegate',
  'RCTAppDelegate',
  'EXAppDelegateWrapper',
] as const;

/** Superclasses and protocols that make a class a scene delegate. */
export const SCENE_DELEGATE_BASES = [
  'UIWindowSceneDelegate',
  'UISceneDelegate',
  'FlutterSceneDelegate',
  'ExpoAppSceneDelegate',
] as const;

const SOURCE_EXTENSIONS: Record<string, Language> = {
  '.swift': 'swift',
  '.m': 'objc',
  '.mm': 'objc',
  '.h': 'objc',
};

/** Folders that hold dependencies, build output or tests rather than the app's own code. */
const SKIPPED =
  /^(Pods|node_modules|build|DerivedData|\.build|Carthage|\.git|\.symlinks|Flutter|.*Tests|.*\.xcodeproj|.*\.xcworkspace|.*\.xcassets|.*\.framework|.*\.xcframework)$/;

/** Every Swift and Objective-C file under `folder`, skipping dependencies, builds and tests. */
export async function listSourceFiles(folder: string): Promise<string[]> {
  const found: string[] = [];
  const walk = async (dir: string, depth: number) => {
    if (depth > 12) return;
    const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!SKIPPED.test(entry.name)) await walk(join(dir, entry.name), depth + 1);
      } else if (entry.isFile() && SOURCE_EXTENSIONS[extname(entry.name)]) {
        found.push(join(dir, entry.name));
      }
    }
  };
  await walk(folder, 0);
  return found.sort();
}

/** App delegates named outside their declaration: SwiftUI's adaptor and UIApplicationMain. */
function namedAppDelegates(files: SourceFile[]): string[] {
  const names: string[] = [];
  for (const file of files) {
    for (const match of file.code.matchAll(/@UIApplicationDelegateAdaptor\s*\(\s*(\w+)\.self/g)) {
      if (match[1]) names.push(match[1]);
    }
    for (const match of file.code.matchAll(
      /UIApplicationMain\s*\([^;]*NSStringFromClass\s*\(\s*\[\s*(\w+)\s+class\s*\]\s*\)/g,
    )) {
      if (match[1]) names.push(match[1]);
    }
  }
  return names;
}

export function sourceFile(path: string, text: string): SourceFile {
  const language = SOURCE_EXTENSIONS[extname(path)] ?? 'swift';
  return {
    path,
    language,
    text,
    code: blankCommentsAndStrings(text, language),
    lineAt: lineIndex(text),
  };
}

/** Builds the index for the given files (already read), e.g. from listSourceFiles. */
export function indexFiles(files: SourceFile[]): SourceIndex {
  const regions = files.flatMap((file) =>
    file.language === 'swift' ? swiftRegions(file) : objcRegions(file),
  );
  const appDelegates = derivedFrom(regions, APP_DELEGATE_BASES);
  for (const name of namedAppDelegates(files)) appDelegates.add(name);
  return {
    files,
    regions,
    appDelegates,
    sceneDelegates: derivedFrom(regions, SCENE_DELEGATE_BASES),
    swiftUIApps: regions.filter(
      (region) => region.kind === 'struct' && region.inherits.includes('App'),
    ),
  };
}

/**
 * The folders whose real path is inside the real `projectRoot`. A folder from the project may be a
 * link (ios/ -> /somewhere/else) or a `..` path; its files are not the project's and are not read.
 * Each folder left out gets a note.
 */
async function foldersInside(
  folders: readonly string[],
  projectRoot: string,
  notes: string[],
): Promise<string[]> {
  const realRoot = await realpath(projectRoot).catch(() => projectRoot);
  const inside: string[] = [];
  for (const folder of folders) {
    const real = await realpath(folder).catch(() => null);
    // A missing folder has no files to read.
    if (real === null) continue;
    if (isInside(real, realRoot)) {
      inside.push(folder);
      continue;
    }
    const shown = relative(projectRoot, folder).split(sep).join('/');
    notes.push(`${shown} is outside the project; its source files were not read.`);
  }
  return inside;
}

/**
 * Reads and indexes every source file under the given folders that is inside `projectRoot`. A
 * folder outside it is skipped with a line in `notes`.
 */
export async function indexSources(
  folders: readonly string[],
  projectRoot: string,
  notes: string[] = [],
): Promise<SourceIndex> {
  const inside = await foldersInside(folders, projectRoot, notes);
  const paths = [...new Set((await Promise.all(inside.map(listSourceFiles))).flat())].sort();
  const reads = await Promise.all(
    paths.map(async (path) => {
      const read = await readProjectFile(path, projectRoot);
      return read.found ? sourceFile(path, read.bytes.toString('utf8')) : null;
    }),
  );
  return indexFiles(reads.filter((file) => file !== null));
}
