// XML property lists, the format Xcode writes into projects. Only what Info.plist files use.
import { lineIndex } from '../core/lines.js';
import { type ParsedPlist, type PlistDict, PlistError, type PlistValue } from './plist-value.js';

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

export function parseXmlPlist(xml: string): ParsedPlist {
  const text = xml.replace(/^﻿/, '');
  if (!/<plist[\s>]/.test(text)) throw new PlistError('Not a property list: no <plist> element.');
  const reader = new XmlReader(tokenize(text), lineIndex(text));
  return { value: reader.document(), keyLines: reader.keyLines };
}
