// The Markdown report, for a pull request comment, a job summary or a file kept with the code.
// render() has already replaced the control characters in every string of the report.
import type { FixAdvice, Finding, Report } from '../model.js';
import {
  ECOSYSTEM_LABELS,
  GUIDES,
  INFO_PLIST_LABELS,
  LIFECYCLE_LABELS,
  plural,
  REPOSITORY_URL,
} from './text.js';

// Every character that can start Markdown or HTML markup inline: links and images ([ ] ( ) !),
// emphasis (* _ ~), code (`), headings (#), HTML and autolinks (< >), entities (&), table cells
// (|) and the backslash itself. A backslash in front makes each one plain text.
const MARKUP = /[\\`*_[\]()#!<>|~&]/g;
// GitHub turns bare URLs, www. addresses, e-mail addresses and @names into links or mentions
// without any markup. A word joiner (U+2060, invisible) after the scheme, the www or the @ stops
// that and leaves the text as it reads.
const BARE_LINKS = /\b(https?|ftp|www)(?=:\/\/|\.)|@/gi;
const WORD_JOINER = '\u2060';
const BACKTICK_RUNS = /`+/g;

/**
 * Text from the checked project (names, versions, paths, plist values) as plain text in a
 * paragraph, heading or table cell: no line breaks, markup or bare links.
 */
const md = (text: string) =>
  text
    .replace(/\s*\n\s*/g, ' ')
    .replace(MARKUP, '\\$&')
    .replace(BARE_LINKS, `$&${WORD_JOINER}`);

/**
 * Inline code that the value cannot close early: the fence is one backtick longer than the
 * longest run of backticks in it, and a space pads a value that starts or ends with a backtick or
 * a space (Markdown strips one space from each side).
 */
const code = (text: string) => {
  const value = text.replace(/\n/g, ' ');
  if (!value) return '';
  const longestRun = Math.max(0, ...(value.match(BACKTICK_RUNS) ?? []).map((run) => run.length));
  const fence = '`'.repeat(longestRun + 1);
  const padding = /^[ `]|[ `]$/.test(value) && value.trim() !== '' ? ' ' : '';
  return `${fence}${padding}${value}${padding}${fence}`;
};
/** GitHub splits a table row on every `|` that has no backslash, inside code spans too. */
const cell = (text: string) => text.replace(/\|/g, '\\|');
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
    ...project.targets.map((target) => {
      const plists =
        target.infoPlistSource === 'file'
          ? target.infoPlists.map(code).join(', ')
          : INFO_PLIST_LABELS[target.infoPlistSource];
      return `Target ${code(target.name)}: ${LIFECYCLE_LABELS[target.lifecycle]} (${plists})`;
    }),
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
      out.push(`| ${item.rule} | ${severity} | ${cell(where(item))} | ${md(item.title)} |`);
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
