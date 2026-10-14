// Regular expressions behind the rules, run over source text whose comments and strings are
// blanked (see collect/blank.ts). The names they look for come from rules/ios27.json; the tests
// check that every hook and window lookup in the data has a pattern here and the other way round.
import type { Language } from '../collect/sources.js';
import type { HookDefinition } from './data.js';

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * The declaration of an app delegate method, built from its names in the rule data:
 * "application(_:open:options:)" matches `func application(_ app: UIApplication, open url: …`,
 * "application:openURL:options:" matches `- (BOOL)application:(UIApplication *)app openURL:…`.
 */
export function methodPattern(hook: HookDefinition, language: Language): RegExp {
  if (language === 'swift') {
    const match = /^(\w+)\(([^)]*)\)$/.exec(hook.swift);
    if (!match) throw new Error(`Hook ${hook.id}: "${hook.swift}" is not a Swift method name.`);
    const [, name = '', labels = ''] = match;
    const second = labels.split(':')[1];
    const tail = second
      ? `\\s*\\(\\s*_\\s+\\w+\\s*:[^,)]*,\\s*${escapeRegExp(second)}\\b`
      : '\\s*\\(';
    return new RegExp(`\\bfunc\\s+${escapeRegExp(name)}${tail}`, 'g');
  }
  const parts = hook.objc.split(':').filter(Boolean);
  const [first = '', second] = parts;
  const tail = second ? `\\s*:\\s*\\([^)]*\\)\\s*\\w+\\s+${escapeRegExp(second)}\\s*:` : '\\s*:';
  return new RegExp(`^\\s*-\\s*\\([^)]*\\)\\s*${escapeRegExp(first)}${tail}`, 'gm');
}

/** A read of a launch option key: `launchOptions?[.url]`, `UIApplicationLaunchOptionsURLKey`. */
export function launchOptionPattern(hook: HookDefinition, language: Language): RegExp {
  if (language === 'objc') return new RegExp(`\\b${escapeRegExp(hook.objc)}\\b`, 'g');
  const key = /\[\.(\w+)\]$/.exec(hook.swift)?.[1];
  if (!key) throw new Error(`Hook ${hook.id}: "${hook.swift}" is not a launch option key.`);
  return new RegExp(
    `\\[\\s*(?:UIApplication\\s*\\.\\s*LaunchOptionsKey\\s*)?\\.\\s*${key}\\s*\\]|LaunchOptionsKey\\s*\\.\\s*${key}\\b`,
    'g',
  );
}

export function hookPattern(hook: HookDefinition, language: Language): RegExp {
  return hook.kind === 'method'
    ? methodPattern(hook, language)
    : launchOptionPattern(hook, language);
}

/**
 * What implementing each hook's replacement looks like in a scene delegate (UIKit) or anywhere in
 * a SwiftUI app. A hook whose replacement is already there is not reported.
 */
export const REPLACEMENTS: Record<string, { uikit: RegExp; swiftUI: RegExp | null }> = {
  'open-url': { uikit: /\bopenURLContexts\b/, swiftUI: /\.onOpenURL\b/ },
  'continue-user-activity': {
    uikit:
      /\bcontinue\s+\w+\s*:\s*NSUserActivity\b|\bscene\s*:\s*\([^)]*\)\s*\w+\s+continueUserActivity\s*:/,
    swiftUI: /\.onContinueUserActivity\b/,
  },
  'will-continue-user-activity': { uikit: /\bwillContinueUserActivityWithType\b/, swiftUI: null },
  'fail-to-continue-user-activity': {
    uikit: /\bdidFailToContinueUserActivityWithType\b/,
    swiftUI: null,
  },
  'quick-action': {
    uikit: /\bwindowScene\b[^{;]*\bperformAction(?:For|ForShortcutItem)\b/,
    swiftUI: null,
  },
  'did-become-active': { uikit: /\bsceneDidBecomeActive\b/, swiftUI: /\bscenePhase\b/ },
  'will-resign-active': { uikit: /\bsceneWillResignActive\b/, swiftUI: /\bscenePhase\b/ },
  'did-enter-background': { uikit: /\bsceneDidEnterBackground\b/, swiftUI: /\bscenePhase\b/ },
  'will-enter-foreground': { uikit: /\bsceneWillEnterForeground\b/, swiftUI: /\bscenePhase\b/ },
  'launch-url': {
    uikit: /\bconnectionOptions\s*\.\s*(?:urlContexts|URLContexts)\b/,
    swiftUI: /\.onOpenURL\b/,
  },
  'launch-user-activity': {
    uikit: /\bconnectionOptions\s*\.\s*userActivities\b/,
    swiftUI: /\.onContinueUserActivity\b/,
  },
  'launch-shortcut-item': { uikit: /\bconnectionOptions\s*\.\s*shortcutItem\b/, swiftUI: null },
  'launch-remote-notification': {
    uikit:
      /\buserNotificationCenter\s*\(\s*_\s+\w+\s*:\s*UNUserNotificationCenter\s*,\s*didReceive\b|userNotificationCenter\s*:\s*\([^)]*\)\s*\w+\s+didReceiveNotificationResponse\s*:/,
    swiftUI: null,
  },
};

/** Window lookups through the application, by window lookup id. */
export const WINDOW_LOOKUPS: Record<
  string,
  { swift: RegExp; objc: RegExp; inAppDelegateOnly: boolean }
> = {
  'key-window': {
    swift: /\bUIApplication\s*\.\s*shared\s*\.\s*keyWindow\b/g,
    objc: /\[\s*UIApplication\s+sharedApplication\s*\]\s*(?:\.\s*keyWindow\b|keyWindow\s*\])|\[\s*\[\s*UIApplication\s+sharedApplication\s*\]\s+keyWindow\s*\]/g,
    inAppDelegateOnly: false,
  },
  windows: {
    swift: /\bUIApplication\s*\.\s*shared\s*\.\s*windows\b/g,
    objc: /\[\s*UIApplication\s+sharedApplication\s*\]\s*\.\s*windows\b|\[\s*\[\s*UIApplication\s+sharedApplication\s*\]\s+windows\s*\]/g,
    inAppDelegateOnly: false,
  },
  'delegate-window': {
    swift: /\bUIApplication\s*\.\s*shared\s*\.\s*delegate\s*[?!]?\s*\.\s*window\b/g,
    objc: /\[\s*\[\s*UIApplication\s+sharedApplication\s*\]\s+delegate\s*\]\s*\.\s*window\b|\[\s*UIApplication\s+sharedApplication\s*\]\s*\.\s*delegate\s*\.\s*window\b/g,
    inAppDelegateOnly: false,
  },
  'app-delegate-window': {
    // Reading the root view controller of the app delegate's own window; assigning it is SCN002.
    swift: /(?<![\w.])(?:self\s*\.\s*)?window\s*[?!]\s*\.\s*rootViewController\b(?!\s*=[^=])/g,
    objc: /\bself\s*\.\s*window\s*\.\s*rootViewController\b(?!\s*=[^=])|\[\s*self\.window\s+rootViewController\s*\]/g,
    inAppDelegateOnly: true,
  },
};

/** The app delegate creating a window of its own. */
export const WINDOW_CREATION: Record<Language, RegExp> = {
  swift: /\bUIWindow\s*\(\s*frame\s*:/g,
  objc: /\[\s*\[\s*UIWindow\s+alloc\s*\]\s*initWithFrame\s*:/g,
};

/** An app delegate that supplies scene configurations in code. */
export const CONFIGURATION_FOR_CONNECTING: Record<Language, RegExp> = {
  swift: /\bfunc\s+application\s*\([^)]*\bconfigurationForConnecting\b/,
  objc: /\bconfigurationForConnectingSceneSession\s*:/,
};
