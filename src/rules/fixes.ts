// Which fix applies to a finding: by ecosystem, version and (for Flutter) whether the Flutter tool
// can migrate the app by itself; and which installed workaround handles it at run time.
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { type AppModel, flutterAppDelegatePaths } from '../collect/app.js';
import { atLeast, majorOf } from '../core/versions.js';
import type { FixAdvice, Mitigation } from '../model.js';
import type {
  FixDefinition,
  HookDefinition,
  RuleData,
  RuleId,
  WorkaroundDefinition,
} from './data.js';

/** Where guides are linked from reports. */
export const GUIDE_BASE = 'https://github.com/muhittincamdali/sdkbump/blob/main/';

export interface Context {
  app: AppModel;
  data: RuleData;
  /** Flutter auto-migration eligibility, computed before the rules run. */
  flutter?: FlutterMigration;
}

export interface FlutterMigration {
  eligible: boolean;
  /** Why the Flutter tool will not migrate the app by itself. */
  reasons: string[];
}

export function fixById(data: RuleData, id: string): FixAdvice {
  const fix = data.fixes.find((candidate) => candidate.id === id);
  if (!fix) throw new Error(`Rule data has no fix ${id}.`);
  return toAdvice(fix);
}

const toAdvice = (fix: FixDefinition): FixAdvice => ({
  id: fix.id,
  title: fix.title,
  steps: fix.steps,
  guide: GUIDE_BASE + fix.guide,
  sources: fix.sources,
});

function workaroundAdvice(workaround: WorkaroundDefinition): FixAdvice {
  return {
    id: `workaround-${workaround.package}`,
    title: `Temporary: install ${workaround.package}`,
    steps: [workaround.summary, ...workaround.limits.map((limit) => `Limit: ${limit}`)],
    guide: `${GUIDE_BASE}docs/guides/react-native-expo.md`,
    sources: workaround.sources,
  };
}

export function installedWorkaround(context: Context, rule: RuleId): Mitigation | null {
  const { project } = context.app;
  for (const workaround of context.data.workarounds) {
    const installed = project.packages.get(workaround.package);
    if (!installed || !workaround.mitigates.includes(rule)) continue;
    if (!workaround.ecosystems.includes(project.ecosystem)) continue;
    return {
      package: workaround.package,
      version: installed.version,
      summary: workaround.summary,
      limits: workaround.limits,
      sources: workaround.sources,
    };
  }
  return null;
}

// ---------------------------------------------------------------------------------------------
// Fix selection

const sha256 = (text: string) => createHash('sha256').update(text.trim()).digest('hex');

/** Mirrors the conditions of Flutter's UISceneMigration (flutter_tools, 3.41 and later). */
export async function flutterMigration(app: AppModel, data: RuleData): Promise<FlutterMigration> {
  const reasons: string[] = [];
  const { project } = app;
  if (project.flutter?.migrationDisabled) {
    reasons.push('pubspec.yaml sets enable-uiscene-migration: false.');
  }
  const runner = app.targets.find((target) => target.name === 'Runner') ?? app.targets[0];
  const storyboard = runner?.infoPlists[0]?.dict.UIMainStoryboardFile;
  if (storyboard !== 'Main') {
    reasons.push('Info.plist does not set UIMainStoryboardFile to Main.');
  }
  const paths = flutterAppDelegatePaths(project.iosDir ?? project.root);
  const read = (path: string) => readFile(path, 'utf8').catch(() => null);
  const swift = await read(paths.swift);
  if (swift !== null) {
    if (!data.flutterTemplates.swift.includes(sha256(swift))) {
      reasons.push('ios/Runner/AppDelegate.swift differs from the templates Flutter migrates.');
    }
  } else {
    const [header, implementation] = await Promise.all([
      read(paths.objcHeader),
      read(paths.objcImplementation),
    ]);
    if (
      header === null ||
      implementation === null ||
      sha256(header) !== data.flutterTemplates.objcHeader ||
      sha256(implementation) !== data.flutterTemplates.objcImplementation
    ) {
      reasons.push('ios/Runner/AppDelegate.h and .m differ from the template Flutter migrates.');
    }
  }
  return { eligible: reasons.length === 0, reasons };
}

export function bridgeAlternative(context: Context): FixAdvice[] {
  const { project } = context.app;
  if (project.ecosystem !== 'react-native' && project.ecosystem !== 'expo') return [];
  if (context.data.workarounds.some((workaround) => project.packages.has(workaround.package))) {
    return [];
  }
  const bridge = context.data.workarounds.find(
    (workaround) => workaround.package === 'react-native-uiscene-bridge',
  );
  return bridge ? [workaroundAdvice(bridge)] : [];
}

/** The fix for an app without scenes, by ecosystem and version. */
export function adoptScenesFix(context: Context): { fix: FixAdvice; alternatives: FixAdvice[] } {
  const { data, app } = context;
  const { project } = app;
  switch (project.ecosystem) {
    case 'native':
      return { fix: fixById(data, 'native-adopt-scenes'), alternatives: [] };
    case 'flutter':
      return context.flutter?.eligible
        ? {
            fix: fixById(data, 'flutter-auto-migrate'),
            alternatives: [fixById(data, 'flutter-manual-migration')],
          }
        : { fix: fixById(data, 'flutter-manual-migration'), alternatives: [] };
    case 'react-native': {
      const version = project.packages.get('react-native')?.version;
      const upgraded = version && atLeast(version, data.milestones.reactNativeScenes);
      return upgraded
        ? {
            fix: fixById(data, 'rn-manual-scene-delegate'),
            alternatives: bridgeAlternative(context),
          }
        : {
            fix: fixById(data, 'rn-upgrade-088'),
            alternatives: [
              fixById(data, 'rn-manual-scene-delegate'),
              ...bridgeAlternative(context),
            ],
          };
    }
    case 'expo':
      return { fix: expoFix(context), alternatives: bridgeAlternative(context) };
  }
}

export function expoFix(context: Context): FixAdvice {
  const { data, app } = context;
  const version = app.project.packages.get('expo')?.version ?? null;
  const major = version ? majorOf(version) : null;
  if (major !== null && major >= (majorOf(data.milestones.expoScenesByDefault) ?? 58)) {
    return fixById(data, 'expo-prebuild');
  }
  if (major === (majorOf(data.milestones.expoSceneSupport) ?? 57)) {
    return app.project.expoConfig?.enableSceneSupport === true && app.project.iosDir
      ? fixById(data, 'expo-prebuild')
      : fixById(data, 'expo-57-scene-support');
  }
  return fixById(data, 'expo-upgrade');
}

export function hookFix(context: Context, hook: HookDefinition, swiftUI: boolean): FixAdvice {
  const { data, app } = context;
  switch (app.project.ecosystem) {
    case 'flutter':
      return fixById(data, 'flutter-scene-delegate-hooks');
    case 'react-native':
      return hook.id === 'open-url' || hook.id === 'continue-user-activity'
        ? fixById(data, 'rn-linking-scene')
        : fixById(data, 'native-move-hook');
    case 'expo':
      return expoFix(context);
    case 'native':
      return swiftUI && hook.swiftUI
        ? fixById(data, 'swiftui-modifier')
        : fixById(data, 'native-move-hook');
  }
}
