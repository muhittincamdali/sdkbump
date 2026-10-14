// The classes, structs, enums, actors and extensions a source file declares (Swift) and its
// @interface and @implementation blocks (Objective-C), and questions about where an offset is.
import type { SourceFile, SourceIndex, TypeRegion } from './sources.js';

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

export function swiftRegions(file: SourceFile): TypeRegion[] {
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

export function objcRegions(file: SourceFile): TypeRegion[] {
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
export function derivedFrom(regions: TypeRegion[], bases: readonly string[]): Set<string> {
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
