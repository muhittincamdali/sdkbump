// scan(): detect the project, collect its app, run the rules and build the report.
import { relative, sep } from 'node:path';
import { type AppModel, collectApp } from './collect/app.js';
import { detectProject } from './detect/project.js';
import {
  type Finding,
  type Lifecycle,
  type Report,
  SCHEMA_VERSION,
  type TargetSummary,
  type Verdict,
  type VersionInfo,
} from './model.js';
import { adoptsScenes, checkApp } from './rules/check.js';
import { loadRuleData, type RuleData } from './rules/data.js';
import { VERSION } from './version.js';

export interface ScanOptions {
  /** Rule data to use instead of the bundled rules/ios27.json (tests). */
  data?: RuleData;
}

const toPosix = (path: string) => path.split(sep).join('/');

function lifecycleOf(app: AppModel, target: AppModel['targets'][number]): Lifecycle {
  if (app.sources.swiftUIApps.some((region) => region.main)) return 'swiftui';
  return adoptsScenes(app, target) ? 'scenes' : 'app-delegate';
}

function versionsOf(app: AppModel): VersionInfo[] {
  const versions: VersionInfo[] = [...app.project.packages.values()].map((entry) => ({
    name: entry.name,
    version: entry.version,
    source: entry.source,
  }));
  if (app.project.flutter) {
    versions.unshift({
      name: 'flutter',
      version: app.project.flutter.version,
      source: app.project.flutter.version ? 'pinned' : 'not pinned',
    });
  }
  return versions;
}

/** One sentence that answers "will it launch?" for the findings. */
export function verdictOf(findings: readonly Finding[], data: RuleData): Verdict {
  const open = findings.filter((item) => !item.mitigation);
  const blocking = open.find((item) => item.rule === 'SCN001' && item.severity === 'error');
  if (blocking) {
    return { code: 'fails-to-launch', text: 'Fails to launch when built with the iOS 27 SDK.' };
  }
  const mitigated = findings.find((item) => item.rule === 'SCN001' && item.mitigation);
  if (mitigated?.mitigation) {
    return {
      code: 'launches-through-workaround',
      text: `Launches through ${mitigated.mitigation.package}, a run-time workaround; the app itself does not adopt scenes.`,
    };
  }
  const hasScenesAndOwnWindow =
    open.some((item) => item.rule === 'SCN002') && !findings.some((item) => item.rule === 'SCN001');
  if (hasScenesAndOwnWindow) {
    return {
      code: 'black-screen',
      text: 'Launches to a black screen: the app delegate creates a window that belongs to no scene.',
    };
  }
  if (open.length > 0) {
    return {
      code: 'review',
      text: `Launches; ${open.length} ${open.length === 1 ? 'finding' : 'findings'} to review.`,
    };
  }
  return {
    code: 'no-findings',
    text: `No findings for the checks in ${data.ruleSet}@${data.dataVersion}.`,
  };
}

/** Checks the project at `path` (a folder, or an .xcodeproj) and returns the report. */
export async function scan(path: string, options: ScanOptions = {}): Promise<Report> {
  const data = options.data ?? loadRuleData();
  const project = await detectProject(path);
  const app = await collectApp(project);
  const display = (absolute: string) => toPosix(relative(project.root, absolute)) || '.';
  const findings: Finding[] = (await checkApp(app, data)).map(({ path: file, ...rest }) => ({
    ...rest,
    file: display(file),
  }));
  const targets: TargetSummary[] = app.targets.map((target) => ({
    name: target.name,
    lifecycle: lifecycleOf(app, target),
    infoPlists: target.infoPlists.map((plist) => display(plist.path)),
  }));
  const notes = app.notes.map((note) => note.split(`${project.root}${sep}`).join(''));
  const installed = data.workarounds.filter((workaround) =>
    project.packages.has(workaround.package),
  );
  if (installed.length > 1) {
    notes.push(
      `${installed.map((workaround) => workaround.package).join(' and ')} are both installed; their READMEs say to use one or the other.`,
    );
  }
  const count = (severity: string) =>
    findings.filter((item) => item.severity === severity && !item.mitigation).length;
  return {
    schemaVersion: SCHEMA_VERSION,
    tool: { name: 'sdkbump', version: VERSION },
    rules: { ruleSet: data.ruleSet, dataVersion: data.dataVersion, sdk: data.sdk },
    project: {
      path,
      name: project.name,
      ecosystem: project.ecosystem,
      versions: versionsOf(app),
      targets,
    },
    verdict: verdictOf(findings, data),
    findings,
    notes,
    summary: {
      errors: count('error'),
      warnings: count('warning'),
      info: count('info'),
      mitigated: findings.filter((item) => item.mitigation).length,
    },
  };
}
