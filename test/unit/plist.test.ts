import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { isDict, type PlistDict, PlistError, parsePlist } from '../../src/collect/plist.js';

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
