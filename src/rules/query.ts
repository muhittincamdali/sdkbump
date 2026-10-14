// Questions the rules ask about an app's sources: where a pattern matches, whether a match is in
// an app delegate, and whether the app gets a scene configuration at all.
import { type AppModel, type AppTarget, sceneManifest } from '../collect/app.js';
import { insideTypeNamed, type SourceFile } from '../collect/sources.js';
import { CONFIGURATION_FOR_CONNECTING } from './patterns.js';

// ---------------------------------------------------------------------------------------------
// Helpers over sources

export interface Match {
  file: SourceFile;
  offset: number;
}

export function* matches(
  files: readonly SourceFile[],
  pattern: (file: SourceFile) => RegExp | null,
) {
  for (const file of files) {
    const regex = pattern(file);
    if (!regex) continue;
    const global = regex.global ? regex : new RegExp(regex.source, `${regex.flags}g`);
    global.lastIndex = 0;
    for (let match = global.exec(file.code); match; match = global.exec(file.code)) {
      // Skip leading whitespace that a multiline pattern may have consumed.
      const offset = match.index + (match[0].length - match[0].trimStart().length);
      yield { file, offset } satisfies Match;
      if (match[0].length === 0) global.lastIndex++;
    }
  }
}

export function inAppDelegate(app: AppModel, match: Match): boolean {
  return insideTypeNamed(app.sources, match.file, match.offset, app.sources.appDelegates);
}

export function sceneDelegateText(app: AppModel): string {
  return app.sources.regions
    .filter((region) => app.sources.sceneDelegates.has(region.name))
    .map((region) => region.file.code.slice(region.start, region.end))
    .join('\n');
}

export const isSwiftUIApp = (app: AppModel) =>
  app.sources.swiftUIApps.some((region) => region.main);

function implementsConfigurationForConnecting(app: AppModel): boolean {
  for (const match of matches(
    app.sources.files,
    (file) => CONFIGURATION_FOR_CONNECTING[file.language],
  )) {
    if (inAppDelegate(app, match)) return true;
  }
  return false;
}

/** Whether a target gets a scene configuration from its Info.plist or the app delegate. */
export function adoptsScenes(app: AppModel, target: AppTarget): boolean {
  if (isSwiftUIApp(app)) return true;
  if (target.infoPlists.some((plist) => sceneManifest(plist).configured)) return true;
  return implementsConfigurationForConnecting(app);
}

export function appDelegateName(app: AppModel): string {
  return [...app.sources.appDelegates][0] ?? 'the app delegate';
}
