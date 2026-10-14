// Swift and Objective-C sources of an app: comments and string literals blanked out (so a pattern
// never matches inside them), the classes, structs and extensions they declare, and which of
// those are app delegates, scene delegates or a SwiftUI App.
import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

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

function lineIndex(text: string): (offset: number) => number {
  const starts = [0];
  for (let index = text.indexOf('\n'); index !== -1; index = text.indexOf('\n', index + 1)) {
    starts.push(index + 1);
  }
  return (offset) => {
    let low = 0;
    let high = starts.length - 1;
    while (low < high) {
      const middle = (low + high + 1) >> 1;
      if ((starts[middle] ?? 0) <= offset) low = middle;
      else high = middle - 1;
    }
    return low + 1;
  };
}

/**
 * Replaces comments and the contents of string and character literals with spaces, keeping
 * newlines and quote characters, so offsets and line numbers stay the same.
 */
export function blankCommentsAndStrings(text: string, language: Language): string {
  const out = text.split('');
  const blank = (from: number, to: number) => {
    for (let index = from; index < to; index++) if (out[index] !== '\n') out[index] = ' ';
  };
  let index = 0;
  while (index < text.length) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '/' && next === '/') {
      const end = text.indexOf('\n', index);
      const stop = end === -1 ? text.length : end;
      blank(index, stop);
      index = stop;
    } else if (char === '/' && next === '*') {
      // Swift block comments nest; Objective-C ones do not.
      let depth = 1;
      let cursor = index + 2;
      while (cursor < text.length && depth > 0) {
        if (text.startsWith('*/', cursor)) {
          depth--;
          cursor += 2;
        } else if (language === 'swift' && text.startsWith('/*', cursor)) {
          depth++;
          cursor += 2;
        } else cursor++;
      }
      blank(index, cursor);
      index = cursor;
    } else if (
      language === 'swift' &&
      (char === '"' || (char === '#' && /^#+"/.test(text.slice(index, index + 8))))
    ) {
      const hashes = /^#*/.exec(text.slice(index))?.[0].length ?? 0;
      const open = index + hashes;
      const multiline = text.startsWith('"""', open);
      const closing = `${multiline ? '"""' : '"'}${'#'.repeat(hashes)}`;
      let cursor = open + (multiline ? 3 : 1);
      while (cursor < text.length) {
        if (hashes === 0 && text[cursor] === '\\') cursor += 2;
        else if (text.startsWith(closing, cursor)) break;
        else if (!multiline && text[cursor] === '\n') break;
        else cursor++;
      }
      const contentEnd = Math.min(cursor, text.length);
      blank(open + (multiline ? 3 : 1), contentEnd);
      index = contentEnd + (text.startsWith(closing, contentEnd) ? closing.length : 0);
    } else if (language === 'objc' && (char === '"' || char === "'")) {
      let cursor = index + 1;
      while (cursor < text.length && text[cursor] !== char && text[cursor] !== '\n') {
        cursor += text[cursor] === '\\' ? 2 : 1;
      }
      blank(index + 1, Math.min(cursor, text.length));
      index = cursor + 1;
    } else index++;
  }
  return out.join('');
}

function matchingBrace(code: string, open: number): number {
  let depth = 0;
  for (let index = open; index < code.length; index++) {
    if (code[index] === '{') depth++;
    else if (code[index] === '}' && --depth === 0) return index;
  }
  return code.length;
}

const KEYWORDS = new Set([
  'func',
  'var',
  'let',
  'subscript',
  'init',
  'deinit',
  'static',
  'override',
]);

const baseName = (type: string) =>
  type
    .replace(/<[^>]*>/g, '')
    .replace(/^(?:any|some|@\w+)\s+/g, '')
    .trim()
    .split('.')
    .at(-1) ?? '';

function swiftRegions(file: SourceFile): TypeRegion[] {
  const regions: TypeRegion[] = [];
  const declaration =
    /\b(class|struct|enum|actor|extension)\s+([A-Za-z_][\w.]*)\s*(?:<[^>{]*>)?\s*(?::\s*([^{]*?))?\s*(?:\bwhere\b[^{]*)?\{/g;
  for (let match = declaration.exec(file.code); match; match = declaration.exec(file.code)) {
    const [, kind, name = '', inherits] = match;
    if (KEYWORDS.has(name)) continue;
    const open = match.index + match[0].length - 1;
    const before = file.code.slice(Math.max(0, match.index - 200), match.index);
    const attributes = before.slice(Math.max(before.lastIndexOf('}'), before.lastIndexOf(';')) + 1);
    regions.push({
      file,
      kind: kind as TypeRegion['kind'],
      name: baseName(name),
      inherits: (inherits ?? '').split(',').map(baseName).filter(Boolean),
      start: open,
      end: matchingBrace(file.code, open),
      line: file.lineAt(match.index),
      main: /@(?:main|UIApplicationMain)\b/.test(attributes),
    });
  }
  return regions;
}

function objcRegions(file: SourceFile): TypeRegion[] {
  const regions: TypeRegion[] = [];
  const declaration =
    /@(interface|implementation)\s+(\w+)\s*(?::\s*(\w+))?\s*(?:\(\s*\w*\s*\))?\s*(?:<([^>]*)>)?/g;
  for (let match = declaration.exec(file.code); match; match = declaration.exec(file.code)) {
    const [, kind, name = '', superclass, protocols] = match;
    const endIndex = file.code.indexOf('@end', match.index);
    regions.push({
      file,
      kind: kind as TypeRegion['kind'],
      name,
      inherits: [superclass, ...(protocols ?? '').split(',')]
        .map((item) => item?.trim() ?? '')
        .filter(Boolean),
      start: match.index,
      end: endIndex === -1 ? file.code.length : endIndex,
      line: file.lineAt(match.index),
      main: false,
    });
  }
  return regions;
}

/** Classes that derive, directly or through other classes in the app, from one of `bases`. */
function derivedFrom(regions: TypeRegion[], bases: readonly string[]): Set<string> {
  const names = new Set<string>(bases);
  const found = new Set<string>();
  let changed = true;
  while (changed) {
    changed = false;
    for (const region of regions) {
      if (region.kind === 'struct' || found.has(region.name)) continue;
      if (region.inherits.some((parent) => names.has(parent))) {
        found.add(region.name);
        names.add(region.name);
        changed = true;
      }
    }
  }
  return found;
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

/** Reads and indexes every source file under the given folders. */
export async function indexSources(folders: readonly string[]): Promise<SourceIndex> {
  const paths = [...new Set((await Promise.all(folders.map(listSourceFiles))).flat())].sort();
  const files = await Promise.all(
    paths.map(async (path) => sourceFile(path, await readFile(path, 'utf8'))),
  );
  return indexFiles(files);
}

/** The innermost type region of `file` that contains `offset`. */
export function regionAt(
  index: SourceIndex,
  file: SourceFile,
  offset: number,
): TypeRegion | undefined {
  let best: TypeRegion | undefined;
  for (const region of index.regions) {
    if (region.file !== file || offset < region.start || offset > region.end) continue;
    if (!best || region.start >= best.start) best = region;
  }
  return best;
}

/** Whether `offset` in `file` is inside the body of a type in `names` (class or extension). */
export function insideTypeNamed(
  index: SourceIndex,
  file: SourceFile,
  offset: number,
  names: ReadonlySet<string>,
): boolean {
  return index.regions.some(
    (region) =>
      region.file === file &&
      offset >= region.start &&
      offset <= region.end &&
      names.has(region.name),
  );
}
