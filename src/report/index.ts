import type { Report } from '../model.js';
import { renderMarkdown } from './markdown.js';
import { renderTty, type TtyOptions } from './tty.js';

export const FORMATS = ['tty', 'markdown', 'json'] as const;
export type Format = (typeof FORMATS)[number];

export type { TtyOptions } from './tty.js';

/** Renders a report as terminal text, Markdown or JSON (the report object as-is). */
export function render(
  report: Report,
  format: Format,
  options: TtyOptions = { color: false },
): string {
  switch (format) {
    case 'tty':
      return renderTty(report, options);
    case 'markdown':
      return renderMarkdown(report);
    case 'json':
      return `${JSON.stringify(report, null, 2)}\n`;
  }
}
