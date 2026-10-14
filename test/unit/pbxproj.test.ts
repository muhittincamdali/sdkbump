import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildsForIOS,
  generatesInfoPlist,
  infoPlistFiles,
  iosAppTargets,
  parseOpenStep,
  readTargets,
  readXcodeProject,
  type XcodeProject,
  XcodeProjectError,
} from '../../src/collect/pbxproj.js';

const fixture = (name: string) => new URL(`../data/pbxproj/${name}`, import.meta.url);

/** Puts a test pbxproj into a temporary `<name>.xcodeproj` folder and reads it back. */
async function project(file: string, name: string): Promise<XcodeProject> {
  const root = mkdtempSync(join(tmpdir(), 'sdkbump-pbxproj-'));
  const folder = join(root, 'ios', `${name}.xcodeproj`);
  mkdirSync(folder, { recursive: true });
  writeFileSync(join(folder, 'project.pbxproj'), readFileSync(fixture(file)));
  return readXcodeProject(folder);
}

describe('parseOpenStep', () => {
  it('reads dictionaries, arrays, quoted and bare strings and skips comments', () => {
    const value = parseOpenStep(`// !$*UTF8*$!
{
  archiveVersion = 1; /* a comment */
  list = ( a, "b c", );
  nested = { "key with space" = "line\\nbreak \\"q\\""; path = "$(SRCROOT)/App/Info.plist"; };
  data = <0fbd 7774>;
}`);
    expect(value).toEqual({
      archiveVersion: '1',
      list: ['a', 'b c'],
      nested: { 'key with space': 'line\nbreak "q"', path: '$(SRCROOT)/App/Info.plist' },
      data: '0fbd7774',
    });
  });

  it.each([
    ['an unclosed dictionary', '{ a = 1;'],
    ['a missing semicolon', '{ a = 1 }'],
    ['an unclosed string', '{ a = "x; }'],
    ['an unclosed comment', '{ /* a = 1; }'],
    ['text after the root', '{ } extra'],
  ])('rejects %s with the line number', (_, text) => {
    expect(() => parseOpenStep(text)).toThrow(XcodeProjectError);
    expect(() => parseOpenStep(text)).toThrow(/line \d+/);
  });
});

describe('readTargets', () => {
  it('reads the Flutter Runner and its test target, merging project-level settings', async () => {
    const runner = await project('flutter-runner.pbxproj', 'Runner');
    expect(runner.targets.map(({ name, productType }) => [name, productType])).toEqual([
      ['Runner', 'com.apple.product-type.application'],
      ['RunnerTests', 'com.apple.product-type.bundle.unit-test'],
    ]);
    const app = runner.targets[0];
    expect(Object.keys(app?.configurations ?? {}).sort()).toEqual(['Debug', 'Profile', 'Release']);
    // SDKROOT is set on the project, INFOPLIST_FILE on the target.
    expect(app?.configurations.Debug?.SDKROOT).toBe('iphoneos');
    expect(app?.configurations.Debug?.INFOPLIST_FILE).toBe('Runner/Info.plist');
  });

  it('only returns iOS app targets from iosAppTargets', async () => {
    const runner = await project('flutter-runner.pbxproj', 'Runner');
    expect(iosAppTargets(runner).map((target) => target.name)).toEqual(['Runner']);
  });

  it('resolves INFOPLIST_FILE against the folder that holds the .xcodeproj', async () => {
    const runner = await project('flutter-runner.pbxproj', 'Runner');
    const app = iosAppTargets(runner)[0];
    if (!app) throw new Error('no app target');
    expect(infoPlistFiles(runner, app)).toEqual({
      files: [join(runner.sourceRoot, 'Runner/Info.plist')],
      unresolved: [],
    });
    expect(generatesInfoPlist(app)).toBe(false);
  });

  it('sees that an xcodegen SwiftUI target generates its Info.plist', async () => {
    const tally = await project('xcodegen-tally.pbxproj', 'Tally');
    const app = iosAppTargets(tally)[0];
    if (!app) throw new Error('no app target');
    expect(generatesInfoPlist(app)).toBe(true);
    expect(app.configurations.Release?.INFOPLIST_KEY_UIApplicationSceneManifest_Generation).toBe(
      'YES',
    );
  });

  it('rejects a property list without objects', () => {
    expect(() => readTargets(parseOpenStep('{ archiveVersion = 1; }'))).toThrow(XcodeProjectError);
  });

  it('reports an .xcodeproj without project.pbxproj', async () => {
    const folder = mkdtempSync(join(tmpdir(), 'sdkbump-empty-'));
    await expect(readXcodeProject(folder)).rejects.toThrow(XcodeProjectError);
  });
});

describe('infoPlistFiles', () => {
  const target = (settings: Record<string, string>) => ({
    name: 'App',
    productType: 'com.apple.product-type.application',
    configurations: { Debug: settings },
  });
  const xcode: XcodeProject = { path: '/p/App.xcodeproj', sourceRoot: '/p', targets: [] };

  it.each([
    ['$(SRCROOT)/App/Info.plist', '/p/App/Info.plist'],
    // biome-ignore lint/suspicious/noTemplateCurlyInString: an Xcode build setting, not a template.
    ['${PROJECT_DIR}/Info.plist', '/p/Info.plist'],
    ['$(TARGET_NAME)/Info.plist', '/p/App/Info.plist'],
  ])('expands %s', (raw, expected) => {
    expect(infoPlistFiles(xcode, target({ INFOPLIST_FILE: raw })).files).toEqual([expected]);
  });

  it('returns paths with unknown variables as unresolved', () => {
    expect(infoPlistFiles(xcode, target({ INFOPLIST_FILE: '$(CONFIG_DIR)/Info.plist' }))).toEqual({
      files: [],
      unresolved: ['$(CONFIG_DIR)/Info.plist'],
    });
  });
});

describe('buildsForIOS', () => {
  it.each([
    [{ SDKROOT: 'iphoneos' }, true],
    [{ SDKROOT: 'iphoneos27.0' }, true],
    [{ SDKROOT: 'macosx' }, false],
    [{ SDKROOT: 'auto', SUPPORTED_PLATFORMS: 'iphoneos iphonesimulator macosx' }, true],
    [{ SDKROOT: 'auto', SUPPORTED_PLATFORMS: 'macosx' }, false],
    [{}, false],
  ])('%o is %s', (settings, expected) => {
    expect(buildsForIOS(settings)).toBe(expected);
  });
});
