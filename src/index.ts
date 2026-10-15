/**
 * Programmatic API. The CLI is a thin layer over these functions; the JSON report format is
 * `schemaVersion` 0 and may change before 1.0.
 *
 * ```ts
 * import { render, scan } from '@mcamdali/sdkbump';
 *
 * const report = await scan('path/to/app');
 * console.log(report.verdict.text);
 * console.log(render(report, 'markdown'));
 * ```
 *
 * @packageDocumentation
 */
export {
  type AppModel,
  type AppTarget,
  collectApp,
  type InfoPlistFile,
  sceneManifest,
} from './collect/app.js';
export {
  type BuildSettings,
  generatesInfoPlist,
  infoPlistFiles,
  iosAppTargets,
  type OpenStepDict,
  type OpenStepValue,
  parseOpenStep,
  readXcodeProject,
  type XcodeProject,
  XcodeProjectError,
  type XcodeTarget,
} from './collect/pbxproj.js';
export {
  isDict,
  type ParsedPlist,
  type PlistDict,
  PlistError,
  type PlistValue,
  parsePlist,
} from './collect/plist.js';
export {
  blankCommentsAndStrings,
  indexSources,
  type Language,
  type SourceFile,
  type SourceIndex,
  type TypeRegion,
} from './collect/sources.js';
export { compareVersions, lowestAllowed } from './core/versions.js';
export {
  detectProject,
  type Ecosystem,
  type ExpoConfig,
  type FlutterInfo,
  type PackageVersion,
  type Project,
  ProjectError,
} from './detect/project.js';
export {
  type FixAdvice,
  type Finding,
  type InfoPlistSource,
  type Lifecycle,
  type Mitigation,
  type Report,
  SCHEMA_VERSION,
  type TargetSummary,
  type Verdict,
  type VerdictCode,
  type VersionInfo,
} from './model.js';
export { FORMATS, type Format, render, type TtyOptions } from './report/index.js';
export { checkApp, type RawFinding } from './rules/check.js';
export {
  loadRuleData,
  parseRuleData,
  type RuleData,
  RuleDataError,
  RuleDataSchema,
  RULE_IDS,
  type RuleId,
  SEVERITIES,
  type Severity,
} from './rules/data.js';
export { type ScanOptions, scan, verdictOf } from './scan.js';
export { VERSION } from './version.js';
