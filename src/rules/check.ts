// The four v0.1 rules (SCN001 to SCN004) over a collected app. Each finding carries the fix that
// applies to this kind of project (rules/fixes.ts) and, for React Native and Expo, an installed
// workaround that handles it at run time.
import type { AppModel, AppTarget } from '../collect/app.js';
import { sceneDelegateClassNames, sceneManifest } from '../collect/app.js';
import { atLeast, majorOf } from '../core/versions.js';
import type { FixAdvice, Finding } from '../model.js';
import type { RuleData, RuleId, RuleSource, Severity } from './data.js';
import {
  adoptScenesFix,
  bridgeAlternative,
  type Context,
  fixById,
  flutterMigration,
  hookFix,
  installedWorkaround,
} from './fixes.js';
import {
  adoptsScenes,
  appDelegateName,
  inAppDelegate,
  isSwiftUIApp,
  matches,
  sceneDelegateText,
} from './query.js';
import { hookPattern, REPLACEMENTS, WINDOW_CREATION, WINDOW_LOOKUPS } from './patterns.js';

export { adoptsScenes } from './query.js';
export { GUIDE_BASE } from './fixes.js';

/** A finding before paths are made relative to the checked folder. */
export type RawFinding = Omit<Finding, 'file'> & { path: string };

function ruleOf(data: RuleData, id: RuleId) {
  const rule = data.rules.find((candidate) => candidate.id === id);
  if (!rule) throw new Error(`Rule data has no rule ${id}.`);
  return rule;
}

function finding(
  context: Context,
  rule: RuleId,
  values: {
    message: string;
    path: string;
    line: number | null;
    target?: string | null;
    fix: FixAdvice | null;
    alternatives?: FixAdvice[];
    severity?: Severity;
    title?: string;
    /** Sources more specific than the rule's own. */
    sources?: RuleSource[];
  },
): RawFinding {
  const definition = ruleOf(context.data, rule);
  return {
    rule,
    severity: values.severity ?? definition.severity,
    title: values.title ?? definition.title,
    message: values.message,
    path: values.path,
    line: values.line,
    target: values.target ?? null,
    owner: 'app',
    fix: values.fix,
    alternatives: values.alternatives ?? [],
    mitigation: installedWorkaround(context, rule),
    sources: values.sources ?? definition.sources,
  };
}

// ---------------------------------------------------------------------------------------------
// Rules

function scn001Expo(context: Context): RawFinding[] {
  const { app, data } = context;
  const { project } = app;
  const expo = project.packages.get('expo');
  const version = expo?.version ?? null;
  const major = version ? majorOf(version) : null;
  const config = project.expoConfig;
  const file = config?.file ?? 'package.json';
  const path = `${project.root}/${file}`;
  const byDefault = majorOf(data.milestones.expoScenesByDefault) ?? 58;
  const supported = majorOf(data.milestones.expoSceneSupport) ?? 57;
  if (major !== null && major >= byDefault) return [];
  const prefix = 'There is no ios/ folder, so this comes from the Expo configuration:';
  if (major === supported) {
    const missing: string[] = [];
    if (version && !atLeast(version, data.milestones.expoSceneSupport)) {
      missing.push(
        `expo is ${version}; scene support needs ${data.milestones.expoSceneSupport} or later`,
      );
    }
    const buildProperties = project.packages.get('expo-build-properties');
    if (!buildProperties) missing.push('expo-build-properties is not a dependency');
    else if (
      buildProperties.version &&
      !atLeast(buildProperties.version, data.milestones.expoBuildProperties)
    ) {
      missing.push(
        `expo-build-properties is ${buildProperties.version}; ${data.milestones.expoBuildProperties} or later is needed`,
      );
    }
    if (config?.enableSceneSupport === null) {
      return [
        finding(context, 'SCN001', {
          severity: 'warning',
          message: `${prefix} ${file} is code, which sdkbump does not run. Built with Expo SDK ${supported} and the iOS 27 SDK, the app launches only if that config sets expo-build-properties ios.enableSceneSupport to true.${missing.length ? ` Also: ${missing.join('; ')}.` : ''}`,
          path,
          line: null,
          fix: fixById(data, 'expo-57-scene-support'),
          alternatives: bridgeAlternative(context),
        }),
      ];
    }
    if (config?.enableSceneSupport !== true) {
      missing.unshift(`${file} does not set expo-build-properties ios.enableSceneSupport to true`);
    }
    if (missing.length === 0) return [];
    return [
      finding(context, 'SCN001', {
        message: `${prefix} Expo SDK ${supported} uses the scene life cycle only when you opt in, and ${missing.join('; ')}. Built with the iOS 27 SDK, the app stops at launch.`,
        path,
        line: null,
        fix: fixById(data, 'expo-57-scene-support'),
        alternatives: bridgeAlternative(context),
      }),
    ];
  }
  return [
    finding(context, 'SCN001', {
      message: `${prefix} expo ${version ?? expo?.declared ?? '(unknown version)'} has no scene support. Built with the iOS 27 SDK, the app stops at launch.`,
      path: `${project.root}/package.json`,
      line: null,
      fix: fixById(data, 'expo-upgrade'),
      alternatives: bridgeAlternative(context),
    }),
  ];
}

/**
 * The target's Info.plist could not be read, so whether it declares a scene is not known. An
 * error here would be a guess: the file may well have a scene manifest.
 */
function scn001NotRead(context: Context, target: AppTarget): RawFinding {
  const { app } = context;
  return finding(context, 'SCN001', {
    severity: 'info',
    title: 'Scene configuration not checked',
    message: `sdkbump could not read the Info.plist of ${target.name} (see the notes), so it cannot tell whether the app declares a scene. ${appDelegateName(app)} does not implement application(_:configurationForConnecting:options:), so built with the iOS 27 SDK the app launches only if that Info.plist has a UIApplicationSceneManifest with a scene configuration.`,
    path: `${target.xcodeProject}/project.pbxproj`,
    line: null,
    target: target.name,
    fix: null,
  });
}

function scn001(context: Context): RawFinding[] {
  const { app } = context;
  if (app.project.ecosystem === 'expo' && !app.project.iosDir) return scn001Expo(context);
  const results: RawFinding[] = [];
  for (const target of app.targets) {
    if (adoptsScenes(app, target)) continue;
    if (target.infoPlistSource === 'not-read') {
      results.push(scn001NotRead(context, target));
      continue;
    }
    const plist = target.infoPlists[0];
    const manifest = plist ? sceneManifest(plist) : { present: false, configured: false };
    const where = plist ? 'Info.plist' : 'The Info.plist Xcode generates';
    const declared = manifest.present
      ? `${where} has UIApplicationSceneManifest but no scene configuration`
      : `${where} has no UIApplicationSceneManifest`;
    let message = `${declared}, and ${appDelegateName(app)} does not implement application(_:configurationForConnecting:options:). Built with the iOS 27 SDK, the app stops at launch: "UIScene life cycle is required for apps built with this SDK".`;
    if (app.project.ecosystem === 'flutter' && context.flutter && !context.flutter.eligible) {
      message += ` Flutter will not migrate it automatically: ${context.flutter.reasons.join(' ')}`;
    }
    if (app.project.ecosystem === 'expo' && app.project.expoConfig?.enableSceneSupport) {
      message += ` ${app.project.expoConfig.file} turns scene support on, but ios/ was generated before.`;
    }
    const { fix, alternatives } = adoptScenesFix(context);
    results.push(
      finding(context, 'SCN001', {
        message,
        path: plist?.path ?? `${target.xcodeProject}/project.pbxproj`,
        line: plist?.keyLines.get('UIApplicationSceneManifest') ?? null,
        target: target.name,
        fix,
        alternatives,
      }),
    );
  }
  return results;
}

function scn002(context: Context): RawFinding[] {
  const { app, data } = context;
  if (isSwiftUIApp(app)) return [];
  const results: RawFinding[] = [];
  const nativeLike = app.project.ecosystem === 'native' || app.project.ecosystem === 'flutter';
  for (const match of matches(app.sources.files, (file) => WINDOW_CREATION[file.language])) {
    if (!inAppDelegate(app, match)) continue;
    const { fix, alternatives } = nativeLike
      ? { fix: fixById(data, 'native-window-in-scene'), alternatives: [] }
      : adoptScenesFix(context);
    results.push(
      finding(context, 'SCN002', {
        message: `${appDelegateName(app)} creates the window with ${match.file.language === 'swift' ? 'UIWindow(frame:)' : '[[UIWindow alloc] initWithFrame:]'}. With a scene, UIKit does not show a window that belongs to no scene, and the app opens to a black screen.`,
        path: match.file.path,
        line: match.file.lineAt(match.offset),
        fix,
        alternatives,
      }),
    );
  }
  return results;
}

/**
 * Whether the app's scene delegate passes scene events on to the app delegate: a scene delegate
 * class in the sources that derives from a forwarder, or a forwarder named directly in Info.plist
 * (Expo SDK 57's opt-in writes EXExpoAppSceneDelegate there and adds no class of its own).
 */
function usesForwardingSceneDelegate(app: AppModel, forwarders: readonly string[]): boolean {
  const derived = app.sources.regions.some(
    (region) =>
      app.sources.sceneDelegates.has(region.name) &&
      region.inherits.some((parent) => forwarders.includes(parent)),
  );
  if (derived) return true;
  return app.targets.some((target) =>
    target.infoPlists.some((plist) =>
      sceneDelegateClassNames(plist).some((name) => forwarders.includes(name)),
    ),
  );
}

function scn003(context: Context): RawFinding[] {
  const { app, data } = context;
  const forwarding = usesForwardingSceneDelegate(app, data.sceneForwarders);
  if (forwarding) return [];
  const swiftUI = isSwiftUIApp(app);
  const sceneCode = sceneDelegateText(app);
  const allCode = app.sources.files.map((file) => file.code).join('\n');
  const results: RawFinding[] = [];
  for (const hook of data.hooks) {
    const replacement = REPLACEMENTS[hook.id];
    if (replacement?.uikit.test(sceneCode)) continue;
    if (swiftUI && replacement?.swiftUI?.test(allCode)) continue;
    for (const match of matches(app.sources.files, (file) => hookPattern(hook, file.language))) {
      if (!inAppDelegate(app, match)) continue;
      const name = match.file.language === 'swift' ? hook.swift : hook.objc;
      const what =
        hook.kind === 'method'
          ? 'UIKit does not call this method'
          : 'UIKit does not put this key in the launch options';
      const message = swiftUI
        ? `A SwiftUI App runs on scenes, so ${what}${hook.kind === 'method' ? ' on the adaptor delegate' : ''}. Use ${hook.swiftUI ?? hook.replacement} instead.`
        : `${what} once the app uses scenes. Use ${hook.replacement}.`;
      results.push(
        finding(context, 'SCN003', {
          title:
            hook.kind === 'method'
              ? `${name} is not called with scenes`
              : `${name} is empty with scenes`,
          message,
          path: match.file.path,
          line: match.file.lineAt(match.offset),
          fix: hookFix(context, hook, swiftUI),
          sources: hook.sources,
        }),
      );
    }
  }
  return results;
}

function scn004(context: Context): RawFinding[] {
  const { app, data } = context;
  const results: RawFinding[] = [];
  for (const lookup of data.windowLookups) {
    const pattern = WINDOW_LOOKUPS[lookup.id];
    if (!pattern) continue;
    for (const match of matches(app.sources.files, (file) => pattern[file.language])) {
      if (pattern.inAppDelegateOnly && !inAppDelegate(app, match)) continue;
      const flutterChannel =
        app.project.ecosystem === 'flutter' && lookup.id === 'app-delegate-window';
      results.push(
        finding(context, 'SCN004', {
          title: lookup.title,
          message: lookup.message,
          path: match.file.path,
          line: match.file.lineAt(match.offset),
          fix: fixById(data, flutterChannel ? 'flutter-engine-bridge' : 'window-from-scene'),
          sources: lookup.sources,
        }),
      );
    }
  }
  return results;
}

/** Runs every rule over the app. Findings are ordered by rule, then file and line. */
export async function checkApp(app: AppModel, data: RuleData): Promise<RawFinding[]> {
  const context: Context = { app, data };
  if (app.project.ecosystem === 'flutter') context.flutter = await flutterMigration(app, data);
  const all = [...scn001(context), ...scn002(context), ...scn003(context), ...scn004(context)];
  return all.sort(
    (a, b) =>
      a.rule.localeCompare(b.rule) || a.path.localeCompare(b.path) || (a.line ?? 0) - (b.line ?? 0),
  );
}
