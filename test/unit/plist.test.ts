import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { MAX_BINARY_PLIST_DEPTH, MAX_BINARY_PLIST_VALUES } from '../../src/collect/plist-binary.js';
import { isDict, type PlistDict, PlistError, parsePlist } from '../../src/collect/plist.js';
import {
  type BinaryObject,
  binaryPlist,
  overlappingStringsPlist,
  sharedOffsetPlist,
  sharedReferencePlist,
} from '../helpers/bplist.js';

const data = (name: string) => readFileSync(new URL(`../data/${name}`, import.meta.url));

const wrap = (body: string) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<plist version="1.0">\n${body}\n</plist>\n`;

describe('parsePlist (XML)', () => {
  it('reads every value type an Info.plist uses', () => {
    const { value } = parsePlist(data('types.xml.plist'));
    expect(value).toEqual({
      Name: 'Café & Cœur ☕',
      Small: 7,
      Large: 5_000_000_000,
      Negative: -3,
      Real: 1.5,
      Yes: true,
      No: false,
      When: new Date('2026-10-15T00:00:00Z'),
      Bytes: Uint8Array.from([0, 1, 2, 255]),
      Many: Array.from({ length: 20 }, (_, index) => index),
      Empty: {},
    });
  });

  it('records the line of each top-level key', () => {
    const { keyLines } = parsePlist(data('Info.xml.plist'));
    expect(keyLines.get('CFBundleDevelopmentRegion')).toBe(5);
    expect(keyLines.get('UIApplicationSceneManifest')).toBe(38);
    // Nested keys are not top-level.
    expect(keyLines.has('UISceneConfigurations')).toBe(false);
  });

  it('keeps nested scene configurations', () => {
    const { value } = parsePlist(data('Info.xml.plist'));
    if (!isDict(value)) throw new Error('not a dict');
    const manifest = value.UIApplicationSceneManifest as PlistDict;
    const configurations = manifest.UISceneConfigurations as PlistDict;
    expect(configurations.UIWindowSceneSessionRoleApplication).toEqual([
      {
        UISceneConfigurationName: 'Default Configuration',
        UISceneDelegateClassName: '$(PRODUCT_MODULE_NAME).SceneDelegate',
      },
    ]);
  });

  it('accepts comments, CDATA, numeric entities and empty elements', () => {
    const { value } = parsePlist(
      wrap(
        '<dict><!-- note --><key>A</key><string><![CDATA[x < y]]></string><key>B</key><string>&#65;&#x42;</string><key>C</key><string/><key>D</key><array/></dict>',
      ),
    );
    expect(value).toEqual({ A: 'x < y', B: 'AB', C: '', D: [] });
  });

  it('reads a string with a byte order mark', () => {
    expect(parsePlist(`﻿${wrap('<string>ok</string>')}`).value).toBe('ok');
  });

  it.each([
    ['no plist element', '<dict></dict>'],
    ['an unclosed dict', wrap('<dict><key>A</key><string>a</string>')],
    ['a value without a key', wrap('<dict><string>a</string></dict>')],
    ['an unknown element', wrap('<set/>')],
    ['a bad integer', wrap('<integer>12a</integer>')],
    ['a missing closing tag', '<plist version="1.0"><string>a</string>'],
  ])('rejects %s', (_, text) => {
    expect(() => parsePlist(text)).toThrow(PlistError);
  });
});

describe('parsePlist (binary)', () => {
  it('reads the same values as the XML file plutil converted', () => {
    expect(parsePlist(data('types.binary.plist')).value).toEqual(
      parsePlist(data('types.xml.plist')).value,
    );
    expect(parsePlist(data('Info.binary.plist')).value).toEqual(
      parsePlist(data('Info.xml.plist')).value,
    );
  });

  it('has no key lines', () => {
    expect(parsePlist(data('Info.binary.plist')).keyLines.size).toBe(0);
  });

  it('rejects a truncated file', () => {
    const bytes = data('Info.binary.plist');
    expect(() => parsePlist(bytes.subarray(0, 20))).toThrow(PlistError);
  });

  it('rejects an offset table that points past the end', () => {
    const bytes = Uint8Array.from(data('Info.binary.plist'));
    const view = new DataView(bytes.buffer);
    view.setBigUint64(bytes.length - 8, BigInt(bytes.length));
    expect(() => parsePlist(bytes)).toThrow(PlistError);
  });
});

describe('parsePlist (binary, hostile)', () => {
  it('reads shared references within the value budget', () => {
    const { value } = parsePlist(sharedReferencePlist(2, 100));
    if (!isDict(value)) throw new Error('not a dict');
    const outer = value.k as boolean[][];
    expect(outer).toHaveLength(100);
    expect(outer.every((inner) => inner.length === 100 && inner.every(Boolean))).toBe(true);
  });

  it('stops a shared-reference amplification at the value budget', () => {
    // Under 2 KB, and 200^4 = 1.6 billion values without a budget.
    const bytes = sharedReferencePlist(4, 200);
    expect(bytes.length).toBeLessThan(2000);
    expect(() => parsePlist(bytes)).toThrow(
      new PlistError(`Binary plist has more than ${MAX_BINARY_PLIST_VALUES} values.`),
    );
  });

  it('decodes a large string once when many references share its offset', () => {
    // 10,000 references, each its own entry in the offset table, all at one 1 MB string: decoded
    // once per reference, that is 10 GB.
    const references = 10_000;
    const bytes = sharedOffsetPlist(references, 1_000_000);
    const decode = vi.spyOn(TextDecoder.prototype, 'decode');
    try {
      const { value } = parsePlist(bytes);
      expect(Array.isArray(value) && value.length).toBe(references);
      const decoded = decode.mock.calls.reduce((sum, [input]) => sum + (input?.byteLength ?? 0), 0);
      expect(decoded / bytes.length).toBeLessThanOrEqual(1);
    } finally {
      decode.mockRestore();
    }
  });

  it('stops overlapping strings at the decoded-bytes budget', () => {
    expect(() => parsePlist(overlappingStringsPlist(20_000))).toThrow(
      new PlistError('Binary plist decodes to more bytes than the file holds.'),
    );
  });

  it('rejects nesting deeper than the limit', () => {
    const depth = MAX_BINARY_PLIST_DEPTH + 1;
    const objects: BinaryObject[] = [{ dict: [[1, 2]] }, { ascii: 'k' }];
    for (let level = 0; level < depth; level++) objects.push({ array: [3 + level] });
    objects.push({ true: true });
    expect(() => parsePlist(binaryPlist(objects))).toThrow(/nests more than/);
  });
});

describe('isDict', () => {
  it.each([
    [{}, true],
    [[], false],
    ['a', false],
    [new Date(0), false],
    [new Uint8Array(), false],
    [undefined, false],
  ])('%o is %s', (value, expected) => {
    expect(isDict(value)).toBe(expected);
  });
});
