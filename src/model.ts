// The report sdkbump produces: one project, its app targets and the findings for them. The JSON
// output is this structure as-is (schemaVersion 0, which may change before 1.0).
import type { Ecosystem, RuleId, RuleSource, Severity } from './rules/data.js';

export const SCHEMA_VERSION = 0;

/** A fix sdkbump suggests, from the `fixes` (or `workarounds`) of the rule data. */
export interface FixAdvice {
  id: string;
  title: string;
  steps: string[];
  /** Link to the sdkbump guide for this kind of project. */
  guide: string;
  sources: RuleSource[];
}

/** A package in the project that works around the finding at run time. */
export interface Mitigation {
  package: string;
  version: string | null;
  summary: string;
  limits: string[];
  sources: RuleSource[];
}

export interface Finding {
  rule: RuleId;
  severity: Severity;
  title: string;
  message: string;
  /** Path relative to the checked folder, with forward slashes. */
  file: string;
  line: number | null;
  /** The app target the finding belongs to, when it is about one target. */
  target: string | null;
  /** Who owns the code: the app itself (dependencies are planned for 0.2). */
  owner: 'app';
  fix: FixAdvice | null;
  alternatives: FixAdvice[];
  /** Set when an installed workaround package handles this at run time. */
  mitigation: Mitigation | null;
  sources: RuleSource[];
}

export type Lifecycle = 'app-delegate' | 'scenes' | 'swiftui';

export interface TargetSummary {
  name: string;
  lifecycle: Lifecycle;
  /** Info.plist paths relative to the checked folder; empty when Xcode generates it. */
  infoPlists: string[];
}

export type VerdictCode =
  'fails-to-launch' | 'launches-through-workaround' | 'black-screen' | 'review' | 'no-findings';

export interface Verdict {
  code: VerdictCode;
  text: string;
}

export interface VersionInfo {
  name: string;
  version: string | null;
  /** installed, lockfile, declared (lowest version the range allows) or pinned (Flutter). */
  source: string;
}

export interface Report {
  schemaVersion: typeof SCHEMA_VERSION;
  tool: { name: 'sdkbump'; version: string };
  rules: { ruleSet: string; dataVersion: string; sdk: string };
  project: {
    /** The folder as given on the command line. */
    path: string;
    name: string;
    ecosystem: Ecosystem;
    versions: VersionInfo[];
    targets: TargetSummary[];
  };
  verdict: Verdict;
  findings: Finding[];
  /** Things sdkbump could not check or that the reader should know. */
  notes: string[];
  summary: { errors: number; warnings: number; info: number; mitigated: number };
}
