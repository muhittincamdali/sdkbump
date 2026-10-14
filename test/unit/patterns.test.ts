import { describe, expect, it } from 'vitest';
import { blankCommentsAndStrings, type Language } from '../../src/collect/sources.js';
import { loadRuleData } from '../../src/rules/data.js';
import {
  CONFIGURATION_FOR_CONNECTING,
  hookPattern,
  WINDOW_CREATION,
  WINDOW_LOOKUPS,
} from '../../src/rules/patterns.js';

const data = loadRuleData();
const hook = (id: string) => {
  const found = data.hooks.find((candidate) => candidate.id === id);
  if (!found) throw new Error(id);
  return found;
};
const count = (pattern: RegExp, text: string, language: Language) => {
  const regex = new RegExp(
    pattern.source,
    pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`,
  );
  return [...blankCommentsAndStrings(text, language).matchAll(regex)].length;
};

/** Declarations as Xcode's templates and the frameworks' headers write them. */
const DECLARATIONS: Record<string, { swift: string; objc: string }> = {
  'open-url': {
    swift:
      'func application(\n    _ app: UIApplication,\n    open url: URL,\n    options: [UIApplication.OpenURLOptionsKey: Any] = [:]\n  ) -> Bool {',
    objc: '- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {',
  },
  'continue-user-activity': {
    swift:
      'override func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {',
    objc: '- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *))handler {',
  },
  'will-continue-user-activity': {
    swift:
      'func application(_ application: UIApplication, willContinueUserActivityWithType userActivityType: String) -> Bool {',
    objc: '- (BOOL)application:(UIApplication *)application willContinueUserActivityWithType:(NSString *)type {',
  },
  'fail-to-continue-user-activity': {
    swift:
      'func application(_ application: UIApplication, didFailToContinueUserActivityWithType userActivityType: String, error: Error) {',
    objc: '- (void)application:(UIApplication *)application didFailToContinueUserActivityWithType:(NSString *)type error:(NSError *)error {',
  },
  'quick-action': {
    swift:
      'func application(_ application: UIApplication, performActionFor shortcutItem: UIApplicationShortcutItem, completionHandler: @escaping (Bool) -> Void) {',
    objc: '- (void)application:(UIApplication *)application performActionForShortcutItem:(UIApplicationShortcutItem *)item completionHandler:(void (^)(BOOL))done {',
  },
  'did-become-active': {
    swift: 'func applicationDidBecomeActive(_ application: UIApplication) {',
    objc: '- (void)applicationDidBecomeActive:(UIApplication *)application {',
  },
  'will-resign-active': {
    swift: 'func applicationWillResignActive(_ application: UIApplication) {',
    objc: '- (void)applicationWillResignActive:(UIApplication *)application {',
  },
  'did-enter-background': {
    swift: 'func applicationDidEnterBackground(_ application: UIApplication) {',
    objc: '- (void)applicationDidEnterBackground:(UIApplication *)application {',
  },
  'will-enter-foreground': {
    swift: 'func applicationWillEnterForeground(_ application: UIApplication) {',
    objc: '- (void)applicationWillEnterForeground:(UIApplication *)application {',
  },
  'launch-url': {
    swift: 'if let url = launchOptions?[.url] as? URL {',
    objc: 'NSURL *url = launchOptions[UIApplicationLaunchOptionsURLKey];',
  },
  'launch-user-activity': {
    swift: 'let activity = launchOptions?[UIApplication.LaunchOptionsKey.userActivityDictionary]',
    objc: 'id activity = launchOptions[UIApplicationLaunchOptionsUserActivityDictionaryKey];',
  },
  'launch-shortcut-item': {
    swift: 'if let item = launchOptions?[.shortcutItem] as? UIApplicationShortcutItem {',
    objc: 'id item = launchOptions[UIApplicationLaunchOptionsShortcutItemKey];',
  },
  'launch-remote-notification': {
    swift: 'let payload = launchOptions?[.remoteNotification] as? [String: Any]',
    objc: 'NSDictionary *payload = launchOptions[UIApplicationLaunchOptionsRemoteNotificationKey];',
  },
};

describe('hook patterns', () => {
  it('has a declaration example for every hook in the data', () => {
    expect(Object.keys(DECLARATIONS).sort()).toEqual(data.hooks.map((item) => item.id).sort());
  });

  it.each(Object.entries(DECLARATIONS))(
    '%s matches its Swift and Objective-C forms',
    (id, forms) => {
      expect(count(hookPattern(hook(id), 'swift'), forms.swift, 'swift')).toBe(1);
      expect(count(hookPattern(hook(id), 'objc'), forms.objc, 'objc')).toBe(1);
    },
  );

  it('tells hooks with the same base name apart', () => {
    const openURL = DECLARATIONS['open-url']?.swift ?? '';
    for (const other of ['continue-user-activity', 'quick-action', 'will-continue-user-activity']) {
      expect(count(hookPattern(hook(other), 'swift'), openURL, 'swift')).toBe(0);
    }
    const launching =
      'func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {';
    for (const item of data.hooks)
      expect(count(hookPattern(item, 'swift'), launching, 'swift')).toBe(0);
  });

  it('does not match calls, comments or strings', () => {
    const text = [
      '// func applicationDidBecomeActive(_ application: UIApplication) {',
      'let note = "launchOptions?[.url]"',
      'delegate.applicationDidBecomeActive(app)',
      'RCTLinkingManager.application(app, open: url, options: options)',
    ].join('\n');
    for (const item of data.hooks) expect(count(hookPattern(item, 'swift'), text, 'swift')).toBe(0);
  });
});

describe('window patterns', () => {
  it.each([
    [
      'key-window',
      'let w = UIApplication.shared.keyWindow',
      'UIWindow *w = [UIApplication sharedApplication].keyWindow;',
    ],
    [
      'windows',
      'UIApplication.shared.windows.first',
      'NSArray *w = [[UIApplication sharedApplication] windows];',
    ],
    [
      'delegate-window',
      'UIApplication.shared.delegate?.window??.rootViewController',
      'UIWindow *w = [[UIApplication sharedApplication] delegate].window;',
    ],
    [
      'app-delegate-window',
      'let controller = window?.rootViewController as! FlutterViewController',
      'UIViewController *root = self.window.rootViewController;',
    ],
  ])('%s matches Swift and Objective-C', (id, swift, objc) => {
    const pattern = WINDOW_LOOKUPS[id];
    if (!pattern) throw new Error(id);
    expect(count(pattern.swift, swift, 'swift')).toBe(1);
    expect(count(pattern.objc, objc, 'objc')).toBe(1);
  });

  it('does not report scene-based lookups or assignments to the window', () => {
    const text = [
      'let windows = windowScene.windows',
      'view.window?.windowScene?.keyWindow',
      'window?.rootViewController = UINavigationController()',
      'self.window?.rootViewController = root',
    ].join('\n');
    for (const pattern of Object.values(WINDOW_LOOKUPS))
      expect(count(pattern.swift, text, 'swift')).toBe(0);
  });

  it('finds window creation and configurationForConnecting', () => {
    expect(
      count(WINDOW_CREATION.swift, 'window = UIWindow(frame: UIScreen.main.bounds)', 'swift'),
    ).toBe(1);
    expect(count(WINDOW_CREATION.swift, 'UIWindow(windowScene: scene)', 'swift')).toBe(0);
    expect(
      count(
        WINDOW_CREATION.objc,
        'self.window = [[UIWindow alloc] initWithFrame:UIScreen.mainScreen.bounds];',
        'objc',
      ),
    ).toBe(1);
    expect(
      count(
        CONFIGURATION_FOR_CONNECTING.swift,
        'func application(\n    _ application: UIApplication,\n    configurationForConnecting connectingSceneSession: UISceneSession,',
        'swift',
      ),
    ).toBe(1);
    expect(
      count(
        CONFIGURATION_FOR_CONNECTING.objc,
        '- (UISceneConfiguration *)application:(UIApplication *)application configurationForConnectingSceneSession:(UISceneSession *)session options:(UISceneConnectionOptions *)options {',
        'objc',
      ),
    ).toBe(1);
  });
});
