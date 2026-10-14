// The Markdown report, for a pull request comment, a job summary or a file kept with the code.
import type { FixAdvice, Finding, Report } from '../model.js';
import {
  clean,
  ECOSYSTEM_LABELS,
  GUIDES,
  LIFECYCLE_LABELS,
  plural,
  REPOSITORY_URL,
} from './text.js';

/** Text that is safe inside a table cell or a paragraph: no control characters, pipes or HTML. */
const md = (text: string) =>
  clean(text)
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/</g, '&lt;')
    .replace(/\n/g, ' ');
/** Inline code that cannot be closed early by a backtick in the value. */
const code = (text: string) => {
  const value = clean(text).replace(/\n/g, ' ');
  const fence = value.includes('`') ? '``' : '`';
  return `${fence}${fence.length > 1 ? ' ' : ''}${value}${fence.length > 1 ? ' ' : ''}${fence}`;
};
const where = (item: Finding) => code(`${item.file}${item.line ? `:${item.line}` : ''}`);

function fixLines(fix: FixAdvice, heading: string): string[] {
  return [
    `**${heading}: ${md(fix.title)}** ([guide](${fix.guide}))`,
    '',
    ...fix.steps.map((step, index) => `${index + 1}. ${md(step)}`),
    '',
  ];
}

export function renderMarkdown(report: Report): string {
  const { project, rules, summary } = report;
  const out = [
    `## sdkbump: ${md(project.name)} (${ECOSYSTEM_LABELS[project.ecosystem]})`,
    '',
    `**${md(report.verdict.text)}**`,
    '',
  ];
  const facts = [
    ...project.targets.map(
      (target) =>
        `Target ${code(target.name)}: ${LIFECYCLE_LABELS[target.lifecycle]}${target.infoPlists.length ? ` (${target.infoPlists.map(code).join(', ')})` : ''}`,
    ),
    ...project.versions.map(
      (version) =>
        `${code(version.name)} ${md(version.version ?? 'unknown')} (${md(version.source)})`,
    ),
  ];
  if (facts.length) out.push(...facts.map((fact) => `- ${fact}`), '');

  if (report.findings.length > 0) {
    out.push('| Rule | Severity | Where | Finding |', '| --- | --- | --- | --- |');
    for (const item of report.findings) {
      const severity = item.mitigation
        ? `${item.severity} (handled by ${md(item.mitigation.package)})`
        : item.severity;
      out.push(`| ${item.rule} | ${severity} | ${where(item)} | ${md(item.title)} |`);
    }
    out.push('', '<details><summary>What each finding means and how to fix it</summary>', '');
    const printed = new Set<string>();
    for (const item of report.findings) {
      out.push(
        `### ${item.rule}: ${md(item.title)}`,
        '',
        `${where(item)}: ${md(item.message)}`,
        '',
      );
      if (item.mitigation) {
        const { mitigation } = item;
        out.push(
          `Handled at run time by ${code(mitigation.package)}${mitigation.version ? ` ${md(mitigation.version)}` : ''}. ${md(mitigation.summary)} Limits: ${md(mitigation.limits.join(' '))}`,
          '',
        );
      }
      [item.fix, ...item.alternatives]
        .filter((fix) => fix !== null)
        .forEach((fix, index) => {
          const heading = index === 0 ? 'Fix' : 'Or';
          if (printed.has(fix.id)) out.push(`**${heading}: ${md(fix.title)}** (steps above)`, '');
          else out.push(...fixLines(fix, heading));
          printed.add(fix.id);
        });
      out.push(
        `Sources: ${item.sources.map((source) => `[${md(source.title)}](${source.url})`).join(', ')}`,
        '',
      );
    }
    out.push('</details>', '');
  }
  for (const note of report.notes) out.push(`> ${md(note)}`, '');
  const counts = [plural(summary.errors, 'error'), plural(summary.warnings, 'warning')];
  if (summary.info) counts.push(`${summary.info} info`);
  if (summary.mitigated) counts.push(`${summary.mitigated} handled by a workaround`);
  out.push(
    `${counts.join(', ')}. Guide: [${ECOSYSTEM_LABELS[project.ecosystem]}](${GUIDES[project.ecosystem]}).`,
    '',
    `<sub>[sdkbump](${REPOSITORY_URL}) ${report.tool.version}, rules ${rules.ruleSet}@${rules.dataVersion} (${md(rules.sdk)}). Static checks; they do not build or run the app.</sub>`,
  );
  return `${out.join('\n')}\n`;
}
