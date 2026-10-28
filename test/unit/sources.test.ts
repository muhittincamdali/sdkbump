import { symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  blankCommentsAndStrings,
  indexFiles,
  indexSources,
  insideTypeNamed,
  listSourceFiles,
  regionAt,
  sourceFile,
} from '../../src/collect/sources.js';
import { tree } from '../helpers/tree.js';

describe('blankCommentsAndStrings', () => {
  it('blanks Swift comments (nested) and string contents, keeping offsets and newlines', () => {
    const text = [
      'let a = "keyWindow" // keyWindow',
      '/* outer /* inner */ still comment */ let b = 1',
      'let c = """',
      'windows',
      '"""',
      'let d = #"raw "keyWindow""#',
      'let e = "esc \\" keyWindow"',
    ].join('\n');
    const code = blankCommentsAndStrings(text, 'swift');
    expect(code).toHaveLength(text.length);
    expect(code.split('\n')).toHaveLength(7);
    expect(code).not.toMatch(/keyWindow|windows|inner|outer/);
    expect(code).toContain('let b = 1');
    expect(code).toContain('let e = "');
  });

  it('blanks Objective-C strings, characters and non-nesting comments', () => {
    const text = 'NSString *s = @"keyWindow"; char c = \'k\'; /* a /* b */ int x; // keyWindow';
    const code = blankCommentsAndStrings(text, 'objc');
    expect(code).not.toMatch(/keyWindow|'k'/);
    expect(code).toContain('int x;');
  });
});

describe('indexFiles', () => {
  it('finds a Swift app delegate, its extension and the role of each type', () => {
    const app = sourceFile(
      '/a/AppDelegate.swift',
      `import UIKit

@main
final class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?
  class func shared() -> AppDelegate? { nil }
}

extension AppDelegate: UNUserNotificationCenterDelegate {
  func x() {}
}

class SceneDelegate: UIResponder, UIWindowSceneDelegate {}
class CustomScene: SceneDelegate {}
struct Model: Codable {}
`,
    );
    const index = indexFiles([app]);
    expect(index.regions.map(({ kind, name, line, main }) => [kind, name, line, main])).toEqual([
      ['class', 'AppDelegate', 4, true],
      ['extension', 'AppDelegate', 9, false],
      ['class', 'SceneDelegate', 13, false],
      ['class', 'CustomScene', 14, false],
      ['struct', 'Model', 15, false],
    ]);
    expect([...index.appDelegates]).toEqual(['AppDelegate']);
    expect([...index.sceneDelegates].sort()).toEqual(['CustomScene', 'SceneDelegate']);
    const offset = app.text.indexOf('func x');
    expect(regionAt(index, app, offset)?.kind).toBe('extension');
    expect(insideTypeNamed(index, app, offset, index.appDelegates)).toBe(true);
    expect(insideTypeNamed(index, app, app.text.indexOf('struct Model'), index.appDelegates)).toBe(
      false,
    );
  });

  it('recognises Flutter, Expo and React Native app delegates', () => {
    const index = indexFiles([
      sourceFile('/f/AppDelegate.swift', '@main\n@objc class AppDelegate: FlutterAppDelegate {}'),
      sourceFile('/e/AppDelegate.swift', '@main\nclass AppDelegate: ExpoAppDelegate {}'),
      sourceFile(
        '/e/SceneDelegate.swift',
        '@objc(SceneDelegate)\nclass SceneDelegate: ExpoAppSceneDelegate {}',
      ),
      sourceFile('/r/AppDelegate.swift', 'class RNDelegate: RCTAppDelegate {}'),
    ]);
    expect([...index.appDelegates].sort()).toEqual(['AppDelegate', 'RNDelegate']);
    expect([...index.sceneDelegates]).toEqual(['SceneDelegate']);
  });

  it('finds a SwiftUI App and the delegate its adaptor names', () => {
    const index = indexFiles([
      sourceFile(
        '/t/TallyApp.swift',
        `@main
struct TallyApp: App {
  @UIApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate
  var body: some Scene { WindowGroup { Text("") } }
}
final class AppDelegate: NSObject {}`,
      ),
    ]);
    expect(index.swiftUIApps.map((region) => region.name)).toEqual(['TallyApp']);
    expect([...index.appDelegates]).toEqual(['AppDelegate']);
  });

  it('reads Objective-C interfaces, categories and implementations', () => {
    const index = indexFiles([
      sourceFile(
        '/o/AppDelegate.h',
        '@interface AppDelegate : UIResponder <UIApplicationDelegate>\n@property UIWindow *window;\n@end',
      ),
      sourceFile(
        '/o/AppDelegate.m',
        '@implementation AppDelegate\n- (void)applicationDidBecomeActive:(UIApplication *)application {}\n@end',
      ),
      sourceFile(
        '/o/main.m',
        'int main(int argc, char * argv[]) { return UIApplicationMain(argc, argv, nil, NSStringFromClass([Bootstrap class])); }',
      ),
    ]);
    expect([...index.appDelegates].sort()).toEqual(['AppDelegate', 'Bootstrap']);
    const implementation = index.regions.find((region) => region.kind === 'implementation');
    expect(implementation?.name).toBe('AppDelegate');
    const file = index.files[1];
    if (!file) throw new Error('missing file');
    expect(
      insideTypeNamed(
        index,
        file,
        file.text.indexOf('applicationDidBecomeActive'),
        index.appDelegates,
      ),
    ).toBe(true);
  });

  it('ignores declarations inside comments and strings', () => {
    const index = indexFiles([
      sourceFile(
        '/c/Doc.swift',
        '// class Fake: UIApplicationDelegate {}\nlet s = "class B: UIApplicationDelegate {"',
      ),
    ]);
    expect(index.regions).toEqual([]);
  });
});

describe('listSourceFiles and indexSources', () => {
  it('reads app sources and skips Pods, tests, Flutter and node_modules', async () => {
    const root = tree({
      'App/AppDelegate.swift': 'class AppDelegate: UIResponder, UIApplicationDelegate {}',
      'App/Legacy/Bridge.m': '@implementation Bridge\n@end',
      'App/Assets.xcassets/Contents.json': '{}',
      'AppTests/AppTests.swift': 'class AppTests {}',
      'Pods/Lib/Lib.swift': 'class Lib {}',
      'node_modules/x/ios/X.m': '@implementation X\n@end',
      'Flutter/Generated.swift': 'class Generated {}',
      'README.md': '# app',
    });
    expect((await listSourceFiles(root)).map((path) => path.slice(root.length + 1))).toEqual([
      join('App', 'AppDelegate.swift'),
      join('App', 'Legacy', 'Bridge.m'),
    ]);
    const index = await indexSources([root, root], root);
    expect(index.files).toHaveLength(2);
    expect([...index.appDelegates]).toEqual(['AppDelegate']);
  });

  it('does not read a source folder linked to a folder outside the project', async () => {
    const outside = tree({
      'Secret.swift': 'class SecretDelegate: UIResponder, UIApplicationDelegate {}',
    });
    const root = tree({
      'App/AppDelegate.swift': 'class AppDelegate: UIResponder, UIApplicationDelegate {}',
    });
    symlinkSync(outside, join(root, 'ios'));
    const notes: string[] = [];
    const index = await indexSources([join(root, 'ios'), join(root, 'App')], root, notes);
    expect(index.files.map((file) => file.path.slice(root.length + 1))).toEqual([
      join('App', 'AppDelegate.swift'),
    ]);
    expect([...index.appDelegates]).toEqual(['AppDelegate']);
    expect(notes).toEqual(['ios is outside the project; its source files were not read.']);
  });

  it('does not read a source folder given as a .. path out of the project', async () => {
    const parent = tree({ 'other/Secret.swift': 'class Secret {}', 'app/Main.swift': '' });
    const root = join(parent, 'app');
    const notes: string[] = [];
    const index = await indexSources([join(root, '..', 'other')], root, notes);
    expect(index.files).toEqual([]);
    expect(notes).toEqual(['../other is outside the project; its source files were not read.']);
  });

  it('reads a source folder linked to a folder inside the project', async () => {
    const root = tree({ 'native/ios/App.swift': 'class App {}' });
    symlinkSync(join(root, 'native', 'ios'), join(root, 'ios'));
    const notes: string[] = [];
    const index = await indexSources([join(root, 'ios')], root, notes);
    expect(index.files.map((file) => file.path.slice(root.length + 1))).toEqual([
      join('ios', 'App.swift'),
    ]);
    expect(notes).toEqual([]);
  });
});
