import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Report } from '../../src/model.js';
import { scan } from '../../src/scan.js';
import { infoPlist, minimalPbxproj, sceneManifest, tree } from '../helpers/tree.js';

const FLUTTER_TEMPLATE = `import Flutter
import UIKit

@main
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
`;

const UIKIT_DELEGATE = `import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    window = UIWindow(frame: UIScreen.main.bounds)
    window?.rootViewController = UIViewController()
    window?.makeKeyAndVisible()
    return true
  }

  func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
    true
  }
}
`;

/** A native app: App.xcodeproj, App/Info.plist and the given sources under App/. */
function nativeApp(plistBody: string, sources: Record<string, string>): string {
  const files: Record<string, string> = {
    'App.xcodeproj/project.pbxproj': minimalPbxproj(),
    'App/Info.plist': infoPlist(plistBody),
  };
  for (const [name, text] of Object.entries(sources)) files[`App/${name}`] = text;
  return tree(files);
}

const rules = (report: Report) => report.findings.map((item) => item.rule);
const fixes = (report: Report) => report.findings.map((item) => item.fix?.id);

describe('SCN001 and the verdict', () => {
  it('reports an app delegate app without a manifest as failing to launch', async () => {
    const report = await scan(nativeApp('', { 'AppDelegate.swift': UIKIT_DELEGATE }));
    expect(rules(report)).toEqual(['SCN001', 'SCN002', 'SCN003']);
    expect(report.findings[0]).toMatchObject({
      severity: 'error',
      file: 'App/Info.plist',
      line: null,
      target: 'App',
      fix: { id: 'native-adopt-scenes' },
    });
    expect(report.findings[0]?.message).toContain('has no UIApplicationSceneManifest');
    expect(report.verdict.code).toBe('fails-to-launch');
    expect(report.project.targets).toEqual([
      { name: 'App', lifecycle: 'app-delegate', infoPlists: ['App/Info.plist'] },
    ]);
    expect(report.summary).toEqual({ errors: 2, warnings: 1, info: 0, mitigated: 0 });
  });

  it('points at a manifest that lists no configuration', async () => {
    const body =
      '\t<key>UIApplicationSceneManifest</key>\n\t<dict>\n\t\t<key>UIApplicationSupportsMultipleScenes</key>\n\t\t<true/>\n\t</dict>';
    const report = await scan(
      nativeApp(body, {
        'AppDelegate.swift': 'class AppDelegate: UIResponder, UIApplicationDelegate {}',
      }),
    );
    expect(report.findings[0]).toMatchObject({ rule: 'SCN001', line: 7 });
    expect(report.findings[0]?.message).toContain(
      'has UIApplicationSceneManifest but no scene configuration',
    );
  });

  it('accepts scene configurations from application(_:configurationForConnecting:options:)', async () => {
    const delegate = `class AppDelegate: UIResponder, UIApplicationDelegate {
  func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
    UISceneConfiguration(name: nil, sessionRole: connectingSceneSession.role)
  }
}`;
    const report = await scan(nativeApp('', { 'AppDelegate.swift': delegate }));
    expect(report.findings).toEqual([]);
    expect(report.project.targets[0]?.lifecycle).toBe('scenes');
    expect(report.verdict).toEqual({
      code: 'no-findings',
      text: 'No findings for the checks in ios27@2026.10.15.',
    });
  });

  it('does not count configurationForConnecting in a comment', async () => {
    const delegate =
      'class AppDelegate: UIResponder, UIApplicationDelegate {\n  // func application(_ a: UIApplication, configurationForConnecting s: UISceneSession) {}\n}';
    expect(rules(await scan(nativeApp('', { 'AppDelegate.swift': delegate })))).toEqual(['SCN001']);
  });

  it('reports a UIKit target whose Info.plist Xcode generates at the project file', async () => {
    const pbxproj = minimalPbxproj().replace(
      'INFOPLIST_FILE = "App/Info.plist";',
      'GENERATE_INFOPLIST_FILE = YES; INFOPLIST_KEY_UIApplicationSceneManifest_Generation = YES;',
    );
    const root = tree({
      'App.xcodeproj/project.pbxproj': pbxproj,
      'App/AppDelegate.swift': 'class AppDelegate: UIResponder, UIApplicationDelegate {}',
    });
    const report = await scan(root);
    expect(report.findings[0]).toMatchObject({
      rule: 'SCN001',
      file: 'App.xcodeproj/project.pbxproj',
    });
    expect(report.findings[0]?.message).toContain('The Info.plist Xcode generates');
  });

  it('notes an INFOPLIST_FILE that does not exist', async () => {
    const root = tree({
      'App.xcodeproj/project.pbxproj': minimalPbxproj('App', 'Missing/Info.plist'),
      'App/AppDelegate.swift': 'class AppDelegate: UIResponder, UIApplicationDelegate {}',
    });
    const report = await scan(root);
    expect(report.notes).toEqual([
      'Missing/Info.plist is named in INFOPLIST_FILE but does not exist.',
    ]);
  });
});

describe('SCN002', () => {
  it('reports a black screen when the app has scenes but the app delegate makes the window', async () => {
    const report = await scan(nativeApp(sceneManifest(), { 'AppDelegate.swift': UIKIT_DELEGATE }));
    expect(rules(report)).toEqual(['SCN002', 'SCN003']);
    expect(report.findings[0]).toMatchObject({ file: 'App/AppDelegate.swift', line: 8 });
    expect(report.verdict.code).toBe('black-screen');
  });

  it('reads Objective-C app delegates', async () => {
    const report = await scan(
      nativeApp('', {
        'AppDelegate.h': '@interface AppDelegate : UIResponder <UIApplicationDelegate>\n@end',
        'AppDelegate.m': `@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  NSURL *url = launchOptions[UIApplicationLaunchOptionsURLKey];
  return YES;
}
- (void)applicationDidBecomeActive:(UIApplication *)application {}
@end`,
      }),
    );
    expect(report.findings.map((item) => [item.rule, item.line])).toEqual([
      ['SCN001', null],
      ['SCN002', 3],
      ['SCN003', 4],
      ['SCN003', 7],
    ]);
  });
});

describe('SCN003', () => {
  it('skips a hook whose scene delegate replacement exists', async () => {
    const scene =
      'class SceneDelegate: UIResponder, UIWindowSceneDelegate {\n  func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {}\n}';
    const delegate =
      'class AppDelegate: UIResponder, UIApplicationDelegate {\n  func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool { true }\n  func applicationDidEnterBackground(_ application: UIApplication) {}\n}';
    const report = await scan(
      nativeApp(sceneManifest(), { 'AppDelegate.swift': delegate, 'SceneDelegate.swift': scene }),
    );
    expect(report.findings.map((item) => item.title)).toEqual([
      'applicationDidEnterBackground(_:) is not called with scenes',
    ]);
    expect(report.findings[0]?.message).toContain('sceneDidEnterBackground(_:)');
  });

  it('tells a SwiftUI app to use the SwiftUI API, unless it already does', async () => {
    const app = (extra: string) => `@main
struct ShopApp: App {
  @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate
  var body: some Scene { WindowGroup { Text("")${extra} } }
}
final class AppDelegate: NSObject, UIApplicationDelegate {
  func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool { true }
}`;
    const without = await scan(nativeApp('', { 'ShopApp.swift': app('') }));
    expect(without.findings).toHaveLength(1);
    expect(without.findings[0]).toMatchObject({ rule: 'SCN003', fix: { id: 'swiftui-modifier' } });
    expect(without.findings[0]?.message).toContain('Use .onOpenURL instead.');
    expect(without.project.targets[0]?.lifecycle).toBe('swiftui');
    expect(
      (await scan(nativeApp('', { 'ShopApp.swift': app('.onOpenURL { _ in }') }))).findings,
    ).toEqual([]);
  });
});

describe('SCN004', () => {
  it('reports application-wide window lookups anywhere in the app', async () => {
    const view =
      'final class Presenter {\n  func show() {\n    UIApplication.shared.keyWindow?.rootViewController?.present(UIViewController(), animated: true)\n  }\n}';
    const report = await scan(nativeApp(sceneManifest(), { 'Presenter.swift': view }));
    expect(report.findings).toMatchObject([
      {
        rule: 'SCN004',
        title: 'Window looked up through keyWindow',
        line: 3,
        fix: { id: 'window-from-scene' },
      },
    ]);
    expect(report.verdict.code).toBe('review');
  });
});

describe('Flutter', () => {
  const flutter = (appDelegate: string, pubspecExtra = '') =>
    tree({
      'pubspec.yaml': `name: shop\ndependencies:\n  flutter:\n    sdk: flutter\n${pubspecExtra}`,
      'ios/Runner.xcodeproj/project.pbxproj': minimalPbxproj('Runner', 'Runner/Info.plist'),
      'ios/Runner/Info.plist': infoPlist(
        '\t<key>UIMainStoryboardFile</key>\n\t<string>Main</string>',
      ),
      'ios/Runner/AppDelegate.swift': appDelegate,
    });

  it('suggests the automatic migration for an unmodified AppDelegate', async () => {
    const report = await scan(flutter(FLUTTER_TEMPLATE));
    expect(rules(report)).toEqual(['SCN001']);
    expect(report.findings[0]?.fix?.id).toBe('flutter-auto-migrate');
    expect(report.findings[0]?.alternatives.map((fix) => fix.id)).toEqual([
      'flutter-manual-migration',
    ]);
  });

  it('explains why a customised AppDelegate needs the manual migration', async () => {
    const report = await scan(
      flutter(FLUTTER_TEMPLATE.replace('return super', '// custom\n    return super')),
    );
    expect(report.findings[0]?.fix?.id).toBe('flutter-manual-migration');
    expect(report.findings[0]?.message).toContain(
      'ios/Runner/AppDelegate.swift differs from the templates Flutter migrates.',
    );
  });

  it('names a disabled migration as a reason', async () => {
    const report = await scan(
      flutter(FLUTTER_TEMPLATE, 'flutter:\n  config:\n    enable-uiscene-migration: false\n'),
    );
    expect(report.findings[0]?.message).toContain('enable-uiscene-migration: false');
  });
});

describe('Expo without ios/', () => {
  const expo = (dependencies: Record<string, string>, files: Record<string, string> = {}) =>
    tree({ 'package.json': JSON.stringify({ name: 'shop', dependencies }), ...files });
  const sceneSupport = JSON.stringify({
    expo: { plugins: [['expo-build-properties', { ios: { enableSceneSupport: true } }]] },
  });

  it.each([
    ['SDK 56', { expo: '~56.0.23' }, {}, 'expo-upgrade', 'package.json'],
    [
      'SDK 57 without the opt-in',
      { expo: '~57.0.29' },
      { 'app.json': '{"expo":{}}' },
      'expo-57-scene-support',
      'app.json',
    ],
    [
      'SDK 57 before 57.0.23',
      { expo: '57.0.22', 'expo-build-properties': '~57.0.20' },
      { 'app.json': sceneSupport },
      'expo-57-scene-support',
      'app.json',
    ],
  ])('reports %s', async (_, dependencies, files, fix, file) => {
    const report = await scan(expo(dependencies, files));
    expect(report.findings).toMatchObject([
      { rule: 'SCN001', severity: 'error', file, fix: { id: fix } },
    ]);
    expect(report.findings[0]?.alternatives.map((item) => item.id)).toEqual([
      'workaround-react-native-uiscene-bridge',
    ]);
  });

  it('accepts SDK 57.0.23+ with expo-build-properties and the opt-in, and SDK 58', async () => {
    const opted = expo(
      { expo: '~57.0.29', 'expo-build-properties': '~57.0.20' },
      { 'app.json': sceneSupport },
    );
    expect((await scan(opted)).findings).toEqual([]);
    expect((await scan(expo({ expo: '~58.0.9' }))).findings).toEqual([]);
  });

  it('warns that app.config.js is not evaluated', async () => {
    const report = await scan(
      expo({ expo: '~57.0.29' }, { 'app.config.js': 'module.exports = {}' }),
    );
    expect(report.findings).toMatchObject([
      { rule: 'SCN001', severity: 'warning', file: 'app.config.js' },
    ]);
  });
});

describe('React Native and Expo with ios/', () => {
  const rnDelegate = `@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?
  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
    window = UIWindow(frame: UIScreen.main.bounds)
    return true
  }
}`;

  it('marks findings a bridge package handles as mitigated', async () => {
    const root = tree({
      'package.json': JSON.stringify({
        dependencies: { 'react-native': '0.87.1', 'react-native-uiscene-bridge': '^0.1.0' },
      }),
      'ios/App.xcodeproj/project.pbxproj': minimalPbxproj(),
      'ios/App/Info.plist': infoPlist(),
      'ios/App/AppDelegate.swift': rnDelegate,
    });
    const report = await scan(root);
    expect(report.findings.map((item) => [item.rule, item.mitigation?.package])).toEqual([
      ['SCN001', 'react-native-uiscene-bridge'],
      ['SCN002', 'react-native-uiscene-bridge'],
    ]);
    expect(report.verdict.code).toBe('launches-through-workaround');
    expect(report.summary).toEqual({ errors: 0, warnings: 0, info: 0, mitigated: 2 });
    expect(fixes(report)).toEqual(['rn-upgrade-088', 'rn-upgrade-088']);
  });

  it('suggests a hand-made scene delegate on React Native 0.88 and later', async () => {
    const root = tree({
      'package.json': JSON.stringify({ dependencies: { 'react-native': '0.88.0' } }),
      'ios/App.xcodeproj/project.pbxproj': minimalPbxproj(),
      'ios/App/Info.plist': infoPlist(),
      'ios/App/AppDelegate.swift': rnDelegate,
    });
    expect(fixes(await scan(root))[0]).toBe('rn-manual-scene-delegate');
  });

  it('trusts ExpoAppSceneDelegate to pass hooks on to the app delegate', async () => {
    const root = tree({
      'package.json': JSON.stringify({ dependencies: { expo: '~57.0.29' } }),
      'ios/App.xcodeproj/project.pbxproj': minimalPbxproj(),
      'ios/App/Info.plist': infoPlist(sceneManifest()),
      'ios/App/AppDelegate.swift':
        'class AppDelegate: ExpoAppDelegate {\n  override func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool { true }\n}',
      'ios/App/SceneDelegate.swift':
        '@objc(SceneDelegate)\nclass SceneDelegate: ExpoAppSceneDelegate {}',
    });
    expect((await scan(root)).findings).toEqual([]);
  });

  it('trusts EXExpoAppSceneDelegate named in Info.plist, as Expo SDK 57 writes it', async () => {
    const root = tree({
      'package.json': JSON.stringify({ dependencies: { expo: '~57.0.29' } }),
      'ios/App.xcodeproj/project.pbxproj': minimalPbxproj(),
      'ios/App/Info.plist': infoPlist(sceneManifest('EXExpoAppSceneDelegate')),
      'ios/App/AppDelegate.swift':
        'class AppDelegate: ExpoAppDelegate {\n  override func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool { true }\n}',
    });
    expect((await scan(root)).findings).toEqual([]);
  });

  it('says when scene support is on but ios/ is older', async () => {
    const root = tree({
      'package.json': JSON.stringify({ dependencies: { expo: '~57.0.29' } }),
      'app.json': JSON.stringify({
        expo: { plugins: [['expo-build-properties', { ios: { enableSceneSupport: true } }]] },
      }),
      'ios/App.xcodeproj/project.pbxproj': minimalPbxproj(),
      'ios/App/Info.plist': infoPlist(),
      'ios/App/AppDelegate.swift': 'class AppDelegate: ExpoAppDelegate {}',
    });
    const report = await scan(root);
    expect(report.findings[0]?.fix?.id).toBe('expo-prebuild');
    expect(report.findings[0]?.message).toContain(
      'app.json turns scene support on, but ios/ was generated before.',
    );
  });
});

describe('report', () => {
  it('carries the rule set and the tool version', async () => {
    const report = await scan(nativeApp('', { 'AppDelegate.swift': UIKIT_DELEGATE }));
    const manifest = JSON.parse(
      readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
    ) as {
      version: string;
    };
    expect(report.schemaVersion).toBe(0);
    expect(report.tool).toEqual({ name: 'sdkbump', version: manifest.version });
    expect(report.rules).toEqual({
      ruleSet: 'ios27',
      dataVersion: '2026.10.15',
      sdk: 'iOS 27.0 SDK (Xcode 27.0, 27A266a)',
    });
    for (const item of report.findings) {
      expect(item.sources.length).toBeGreaterThan(0);
      expect(item.fix?.guide).toMatch(
        /^https:\/\/github\.com\/muhittincamdali\/sdkbump\/blob\/main\/docs\/guides\//,
      );
    }
  });
});
