// Property list reader for Info.plist files: the XML format Xcode writes into projects and the
// binary format (bplist00) found in built apps. No dependencies; only what Info.plist files use.

export type PlistValue =
  string | number | bigint | boolean | Date | Uint8Array | PlistValue[] | PlistDict;

export interface PlistDict {
  [key: string]: PlistValue;
}

export interface ParsedPlist {
  value: PlistValue;
  /** 1-based line of each top-level `<key>` in an XML plist; empty for binary plists. */
  keyLines: ReadonlyMap<string, number>;
}

export class PlistError extends Error {
  override name = 'PlistError';
}

const BINARY_MAGIC = 'bplist00';

/** Parses an XML or binary property list. Throws PlistError for anything else. */
export function parsePlist(data: Uint8Array | string): ParsedPlist {
  if (typeof data !== 'string') {
    const head = new TextDecoder('latin1').decode(data.subarray(0, BINARY_MAGIC.length));
    if (head === BINARY_MAGIC) return { value: parseBinaryPlist(data), keyLines: new Map() };
    return parseXmlPlist(new TextDecoder().decode(data));
  }
  return parseXmlPlist(data);
}

export function isDict(value: PlistValue | undefined): value is PlistDict {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    !(value instanceof Uint8Array)
  );
}

// ---------------------------------------------------------------------------------------------
// XML

interface Token {
  kind: 'open' | 'close' | 'empty' | 'text';
  name: string;
  text: string;
  offset: number;
}

const ENTITIES: Record<string, string> = { lt: '<', gt: '>', amp: '&', quot: '"', apos: "'" };

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-z]+);/g, (whole, entity: string) => {
    if (entity.startsWith('#x')) return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
    if (entity.startsWith('#')) return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
    return ENTITIES[entity] ?? whole;
  });
}

function tokenize(xml: string): Token[] {
  const tokens: Token[] = [];
  const tag =
    /<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<!DOCTYPE[^>]*>|<!\[CDATA\[([\s\S]*?)\]\]>|<(\/?)([A-Za-z_][\w.-]*)[^>]*?(\/?)>/g;
  let last = 0;
  for (let match = tag.exec(xml); match; match = tag.exec(xml)) {
    if (match.index > last) {
      tokens.push({
        kind: 'text',
        name: '',
        text: decodeEntities(xml.slice(last, match.index)),
        offset: last,
      });
    }
    last = tag.lastIndex;
    if (match[1] !== undefined) {
      tokens.push({ kind: 'text', name: '', text: match[1], offset: match.index });
    } else if (match[3]) {
      const kind = match[2] ? 'close' : match[4] ? 'empty' : 'open';
      tokens.push({ kind, name: match[3], text: '', offset: match.index });
    }
  }
  if (last < xml.length) {
    tokens.push({ kind: 'text', name: '', text: decodeEntities(xml.slice(last)), offset: last });
  }
  // Text between elements is whitespace except inside <key>, <string> and friends; merging
  // adjacent text (CDATA next to plain text) keeps one text token per element.
  const merged: Token[] = [];
  for (const token of tokens) {
    const previous = merged.at(-1);
    if (token.kind === 'text' && previous?.kind === 'text') previous.text += token.text;
    else merged.push(token);
  }
  return merged;
}

class XmlReader {
  private index = 0;
  readonly keyLines = new Map<string, number>();

  constructor(
    private readonly tokens: Token[],
    private readonly lineAt: (offset: number) => number,
  ) {}

  private next(): Token | undefined {
    while (this.index < this.tokens.length) {
      const token = this.tokens[this.index++];
      if (token && !(token.kind === 'text' && token.text.trim() === '')) return token;
    }
    return undefined;
  }

  private peek(): Token | undefined {
    const saved = this.index;
    const token = this.next();
    this.index = saved;
    return token;
  }

  private textUntil(name: string): string {
    let text = '';
    for (let token = this.tokens[this.index++]; token; token = this.tokens[this.index++]) {
      if (token.kind === 'text') text += token.text;
      else if (token.kind === 'close' && token.name === name) return text;
      else throw new PlistError(`Unexpected <${token.name}> inside <${name}>.`);
    }
    throw new PlistError(`<${name}> is not closed.`);
  }

  document(): PlistValue {
    const root = this.next();
    if (root?.name !== 'plist' || root.kind !== 'open') {
      throw new PlistError('Not a property list: no <plist> element.');
    }
    const value = this.value(true);
    const end = this.next();
    if (end?.kind !== 'close' || end.name !== 'plist') {
      throw new PlistError('Not a property list: expected </plist>.');
    }
    return value;
  }

  private value(topLevel = false): PlistValue {
    const token = this.next();
    if (!token || token.kind === 'text' || token.kind === 'close') {
      throw new PlistError('Expected a value element.');
    }
    if (token.kind === 'empty') return this.emptyValue(token.name);
    switch (token.name) {
      case 'dict':
        return this.dict(topLevel);
      case 'array':
        return this.array();
      case 'string':
        return this.textUntil('string');
      case 'integer': {
        const text = this.textUntil('integer').trim();
        if (!/^[+-]?\d+$/.test(text)) throw new PlistError(`Not an integer: ${text}`);
        const big = BigInt(text);
        return Number.isSafeInteger(Number(big)) ? Number(big) : big;
      }
      case 'real': {
        const number = Number(this.textUntil('real').trim());
        if (Number.isNaN(number)) throw new PlistError('Not a real number.');
        return number;
      }
      case 'true':
      case 'false':
        this.textUntil(token.name);
        return token.name === 'true';
      case 'date':
        return new Date(this.textUntil('date').trim());
      case 'data':
        return Uint8Array.from(Buffer.from(this.textUntil('data').replace(/\s+/g, ''), 'base64'));
      default:
        throw new PlistError(`Unknown element <${token.name}>.`);
    }
  }

  private emptyValue(name: string): PlistValue {
    switch (name) {
      case 'true':
        return true;
      case 'false':
        return false;
      case 'dict':
        return {};
      case 'array':
        return [];
      case 'string':
        return '';
      case 'data':
        return new Uint8Array();
      default:
        throw new PlistError(`Unknown element <${name}/>.`);
    }
  }

  private dict(topLevel: boolean): PlistDict {
    const result: PlistDict = {};
    for (;;) {
      const token = this.peek();
      if (!token) throw new PlistError('<dict> is not closed.');
      if (token.kind === 'close' && token.name === 'dict') {
        this.next();
        return result;
      }
      const keyToken = this.next();
      if (keyToken?.name !== 'key') throw new PlistError('Expected <key> in <dict>.');
      const key = keyToken.kind === 'empty' ? '' : this.textUntil('key');
      if (topLevel) this.keyLines.set(key, this.lineAt(keyToken.offset));
      result[key] = this.value();
    }
  }

  private array(): PlistValue[] {
    const result: PlistValue[] = [];
    for (;;) {
      const token = this.peek();
      if (!token) throw new PlistError('<array> is not closed.');
      if (token.kind === 'close' && token.name === 'array') {
        this.next();
        return result;
      }
      result.push(this.value());
    }
  }
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

export function parseXmlPlist(xml: string): ParsedPlist {
  const text = xml.replace(/^﻿/, '');
  if (!/<plist[\s>]/.test(text)) throw new PlistError('Not a property list: no <plist> element.');
  const reader = new XmlReader(tokenize(text), lineIndex(text));
  return { value: reader.document(), keyLines: reader.keyLines };
}

// ---------------------------------------------------------------------------------------------
// Binary (bplist00): https://opensource.apple.com/source/CF/CF-1153.18/CFBinaryPList.c

const APPLE_EPOCH_MS = Date.UTC(2001, 0, 1);

export function parseBinaryPlist(bytes: Uint8Array): PlistValue {
  if (bytes.length < BINARY_MAGIC.length + 32) throw new PlistError('Binary plist is too short.');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const trailer = bytes.length - 32;
  const offsetSize = view.getUint8(trailer + 6);
  const refSize = view.getUint8(trailer + 7);
  const objectCount = Number(view.getBigUint64(trailer + 8));
  const topObject = Number(view.getBigUint64(trailer + 16));
  const tableOffset = Number(view.getBigUint64(trailer + 24));
  if (offsetSize < 1 || offsetSize > 8 || refSize < 1 || refSize > 8) {
    throw new PlistError('Binary plist trailer is not valid.');
  }
  if (tableOffset + objectCount * offsetSize > trailer || topObject >= objectCount) {
    throw new PlistError('Binary plist offset table is out of range.');
  }

  const readUint = (at: number, size: number): number => {
    if (at + size > bytes.length) throw new PlistError('Binary plist reads past its end.');
    let value = 0;
    for (let index = 0; index < size; index++) value = value * 256 + (bytes[at + index] ?? 0);
    return value;
  };
  const offsetOf = (ref: number) => readUint(tableOffset + ref * offsetSize, offsetSize);
  const visiting = new Set<number>();

  const lengthAt = (at: number, info: number): [number, number] => {
    if (info !== 0xf) return [info, at + 1];
    const marker = bytes[at + 1] ?? 0;
    if (marker >> 4 !== 0x1) throw new PlistError('Binary plist length is not an integer.');
    const size = 1 << (marker & 0xf);
    return [readUint(at + 2, size), at + 2 + size];
  };

  const read = (ref: number): PlistValue => {
    if (ref >= objectCount) throw new PlistError('Binary plist object reference is out of range.');
    if (visiting.has(ref)) throw new PlistError('Binary plist contains a reference cycle.');
    visiting.add(ref);
    try {
      return readObject(offsetOf(ref));
    } finally {
      visiting.delete(ref);
    }
  };

  const readObject = (at: number): PlistValue => {
    const marker = bytes[at];
    if (marker === undefined) throw new PlistError('Binary plist object is out of range.');
    const type = marker >> 4;
    const info = marker & 0xf;
    switch (type) {
      case 0x0:
        if (info === 0x8) return false;
        if (info === 0x9) return true;
        throw new PlistError(`Unsupported binary plist marker 0x${marker.toString(16)}.`);
      case 0x1: {
        const size = 1 << info;
        if (size === 16) return view.getBigInt64(at + 9);
        if (size === 8) {
          const big = view.getBigInt64(at + 1);
          return Number.isSafeInteger(Number(big)) ? Number(big) : big;
        }
        return readUint(at + 1, size);
      }
      case 0x2:
        return info === 2 ? view.getFloat32(at + 1) : view.getFloat64(at + 1);
      case 0x3:
        return new Date(APPLE_EPOCH_MS + view.getFloat64(at + 1) * 1000);
      case 0x4: {
        const [length, start] = lengthAt(at, info);
        return Uint8Array.from(bytes.subarray(start, start + length));
      }
      case 0x5: {
        const [length, start] = lengthAt(at, info);
        return new TextDecoder('latin1').decode(bytes.subarray(start, start + length));
      }
      case 0x6: {
        const [length, start] = lengthAt(at, info);
        let text = '';
        for (let index = 0; index < length; index++) {
          text += String.fromCharCode(readUint(start + index * 2, 2));
        }
        return text;
      }
      case 0x8:
        return readUint(at + 1, info + 1);
      case 0xa: {
        const [length, start] = lengthAt(at, info);
        const items: PlistValue[] = [];
        for (let index = 0; index < length; index++) {
          items.push(read(readUint(start + index * refSize, refSize)));
        }
        return items;
      }
      case 0xd: {
        const [length, start] = lengthAt(at, info);
        const dict: PlistDict = {};
        for (let index = 0; index < length; index++) {
          const key = read(readUint(start + index * refSize, refSize));
          if (typeof key !== 'string')
            throw new PlistError('Binary plist dictionary key is not a string.');
          dict[key] = read(readUint(start + (length + index) * refSize, refSize));
        }
        return dict;
      }
      default:
        throw new PlistError(`Unsupported binary plist marker 0x${marker.toString(16)}.`);
    }
  };

  return read(topObject);
}
