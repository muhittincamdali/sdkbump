import type { Report } from '../model.js';
import { renderMarkdown } from './markdown.js';
import { withoutControlCharacters } from './text.js';
import { renderTty, type TtyOptions } from './tty.js';

export const FORMATS = ['tty', 'markdown', 'json'] as const;
export type Format = (typeof FORMATS)[number];

export type { TtyOptions } from './tty.js';

/**
 * Renders a report as terminal text, Markdown or JSON (the report object as-is). This is the one
 * way out for a report: every string in it has its control characters replaced here, whatever the
 * format, before it reaches a terminal, a file or a pull request comment. JSON.stringify escapes
 * only U+0000 to U+001F, so DEL and C1 controls would otherwise reach the JSON output raw.
 */
export function render(
  input: Report,
  format: Format,
  options: TtyOptions = { color: false },
): string {
  const report = withoutControlCharacters(input);
  switch (format) {
    case 'tty':
      return renderTty(report, options);
    case 'markdown':
      return renderMarkdown(report);
    case 'json':
      return `${JSON.stringify(report, null, 2)}\n`;
  }
}
