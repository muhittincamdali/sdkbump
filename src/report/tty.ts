// The terminal report: the verdict first, then each finding with where it is and what it means,
// then each fix once, lettered, with its steps and guide. Findings name the fixes by letter.
import type { FixAdvice, Finding, Report } from '../model.js';
import {
  clean,
  ECOSYSTEM_LABELS,
  GUIDES,
  INFO_PLIST_LABELS,
  LIFECYCLE_LABELS,
  plural,
  REPOSITORY_URL,
  wrap,
} from './text.js';

export interface TtyOptions {
  color: boolean;
  /** Total width to wrap to (default 100, at least 60). */
  width?: number;
}

type Style = 'bold' | 'dim' | 'red' | 'yellow' | 'cyan' | 'green';
const CODES: Record<Style, [number, number]> = {
  bold: [1, 22],
  dim: [2, 22],
  red: [31, 39],
  yellow: [33, 39],
  green: [32, 39],
  cyan: [36, 39],
};

const LABEL_WIDTH = 9;
const INDENT = ' '.repeat(LABEL_WIDTH);
const SEVERITY_STYLE = { error: 'red', warning: 'yellow', info: 'cyan' } as const;
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

type Paint = (style: Style, text: string) => string;

function painter(color: boolean): Paint {
  return (style, text) => {
    if (!color) return text;
    const [open, close] = CODES[style];
    return `\u001b[${open}m${text}\u001b[${close}m`;
  };
}

/** Each distinct fix of the report with its letter, in order of first appearance. */
function letterFixes(
  findings: readonly Finding[],
): Map<string, { letter: string; fix: FixAdvice }> {
  const result = new Map<string, { letter: string; fix: FixAdvice }>();
  for (const item of findings) {
    for (const fix of [item.fix, ...item.alternatives]) {
      if (!fix || result.has(fix.id)) continue;
      result.set(fix.id, { letter: LETTERS[result.size] ?? '?', fix });
    }
  }
  return result;
}

function header(report: Report, paint: Paint, width: number): string[] {
  const { project, rules } = report;
  const dim = (text: string) => wrap(clean(text), width).map((line) => paint('dim', line));
  const [name = '', ...rest] = wrap(
    clean(`${project.name} · ${ECOSYSTEM_LABELS[project.ecosystem]} · ${project.path}`),
    width,
  );
  const nameLength = clean(project.name).length;
  const lines = [
    ...dim(
      `sdkbump ${report.tool.version} · rules ${rules.ruleSet}@${rules.dataVersion} · ${rules.sdk}`,
    ),
    '',
    `${paint('bold', name.slice(0, nameLength))}${name.slice(nameLength)}`,
    ...rest,
  ];
  for (const version of project.versions) {
    lines.push(...dim(`${version.name} ${version.version ?? '(unknown)'} (${version.source})`));
  }
  for (const target of project.targets) {
    const plists =
      target.infoPlistSource === 'file'
        ? target.infoPlists.join(', ')
        : INFO_PLIST_LABELS[target.infoPlistSource];
    lines.push(...dim(`target ${target.name}: ${LIFECYCLE_LABELS[target.lifecycle]} (${plists})`));
  }
  const style =
    report.verdict.code === 'fails-to-launch' || report.verdict.code === 'black-screen'
      ? 'red'
      : report.verdict.code === 'no-findings'
        ? 'green'
        : 'yellow';
  lines.push(
    '',
    ...wrap(report.verdict.text, width).map((line) => paint('bold', paint(style, line))),
    '',
  );
  return lines;
}

export function renderTty(report: Report, options: TtyOptions): string {
  const paint = painter(options.color);
  const width = Math.max(60, options.width ?? 100);
  const body = (text: string, style?: Style) =>
    wrap(clean(text), width - LABEL_WIDTH).map(
      (line) => `${INDENT}${style ? paint(style, line) : line}`,
    );
  const fixes = letterFixes(report.findings);
  const out = header(report, paint, width);

  for (const item of report.findings) {
    const label = (item.mitigation ? 'HANDLED' : item.severity.toUpperCase()).padEnd(LABEL_WIDTH);
    const style = item.mitigation ? 'green' : SEVERITY_STYLE[item.severity];
    const [titleFirst = '', ...titleRest] = wrap(
      clean(`${item.rule}  ${item.title}`),
      width - LABEL_WIDTH,
    );
    out.push(
      `${paint('bold', paint(style, label))}${paint('bold', titleFirst)}`,
      ...titleRest.map((line) => `${INDENT}${paint('bold', line)}`),
      `${INDENT}${paint('cyan', clean(`${item.file}${item.line ? `:${item.line}` : ''}`))}`,
      ...body(item.message),
    );
    if (item.mitigation) {
      const { mitigation } = item;
      const version = mitigation.version ? ` ${mitigation.version}` : '';
      out.push(
        ...body(
          `Handled at run time by ${mitigation.package}${version}. Limits: ${mitigation.limits.join(' ')}`,
          'dim',
        ),
      );
    }
    const named = [item.fix, ...item.alternatives]
      .filter((fix) => fix !== null)
      .map((fix) => `[${fixes.get(fix.id)?.letter}] ${fix.title}`);
    if (named.length) out.push(...body(`Fix: ${named.join('; or ')}`, 'bold'));
    out.push('');
  }

  if (fixes.size > 0) {
    out.push(paint('bold', 'How to fix'), '');
    for (const { letter, fix } of fixes.values()) {
      out.push(
        `${paint('bold', `[${letter}]`.padEnd(LABEL_WIDTH))}${paint('bold', clean(fix.title))}`,
      );
      fix.steps.forEach((step, index) => {
        const marker = `${index + 1}. `;
        const [first = '', ...rest] = wrap(clean(step), width - LABEL_WIDTH - marker.length);
        out.push(
          `${INDENT}${marker}${first}`,
          ...rest.map((line) => `${INDENT}${' '.repeat(marker.length)}${line}`),
        );
      });
      out.push(`${INDENT}${paint('dim', fix.guide)}`, '');
    }
  }

  for (const note of report.notes)
    out.push(...wrap(clean(`Note: ${note}`), width).map((line) => paint('dim', line)));
  if (report.notes.length) out.push('');
  const { errors, warnings, info, mitigated } = report.summary;
  const counts = [plural(errors, 'error'), plural(warnings, 'warning')];
  if (info) counts.push(`${info} info`);
  if (mitigated) counts.push(`${mitigated} handled by a workaround`);
  out.push(paint('bold', counts.join(', ')), `Guide: ${GUIDES[report.project.ecosystem]}`);
  if (report.findings.length === 0)
    out.push(`What is checked: ${REPOSITORY_URL}#what-sdkbump-checks`);
  return `${out.join('\n')}\n`;
}
