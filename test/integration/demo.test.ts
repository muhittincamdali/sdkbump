import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  DEMOS,
  mediaPath,
  record,
  SIMULATOR_SESSIONS,
  simulatorSession,
} from '../../scripts/demo.ts';
import { parseAnsi, terminalSvg } from '../../scripts/terminal-svg.ts';

// The version in the first output line changes with each release; the demo stays valid.
const withoutVersion = (svg: string) =>
  svg.replace(/sdkbump \d+\.\d+\.\d+(?:-[\w.]+)?/g, 'sdkbump x');

describe('parseAnsi', () => {
  it('splits a line into styled spans', () => {
    expect(parseAnsi('\u001b[1m\u001b[31mERROR\u001b[39m\u001b[22m  plain')).toEqual([
      { text: 'ERROR', bold: true, dim: false, color: 'red' },
      { text: '  plain', bold: false, dim: false, color: null },
    ]);
  });

  it('resets on code 0 and keeps text without codes', () => {
    expect(parseAnsi('\u001b[2mdim\u001b[0m end')).toEqual([
      { text: 'dim', bold: false, dim: true, color: null },
      { text: ' end', bold: false, dim: false, color: null },
    ]);
  });
});

describe('terminalSvg', () => {
  const session = { title: 'demo', command: 'npx @mcamdali/sdkbump', output: 'a <b> & c\n' };

  it('escapes text and carries no scripts or external references', () => {
    const svg = terminalSvg(session, 'dark');
    expect(svg).toContain('a &lt;b&gt; &amp; c');
    expect(svg).not.toMatch(/<script|href=|url\(|@import/);
  });

  it('shows everything at once when motion is reduced', () => {
    expect(terminalSvg(session, 'light')).toContain('@media (prefers-reduced-motion:reduce)');
  });

  it('uses only blues from the kit palette for status colours', () => {
    const svg = terminalSvg(
      { ...session, output: '\u001b[31mred\u001b[33myellow\u001b[32mgreen\n' },
      'light',
    );
    expect(svg).not.toMatch(/#(?:FF0000|FFFF00|00FF00)/i);
  });
});

describe.each(DEMOS)('docs/media/demo-$name', (demo) => {
  it('matches what the CLI prints today (npm run demo records it again)', () => {
    const session = record(demo);
    expect(session.output).toContain('sdkbump');
    for (const theme of ['light', 'dark'] as const) {
      const committed = readFileSync(mediaPath(demo.name, theme), 'utf8');
      expect(withoutVersion(committed)).toBe(withoutVersion(terminalSvg(session, theme)));
    }
  });
});

describe.each(SIMULATOR_SESSIONS)('docs/media/demo-simulator-%s', (fixture) => {
  it('is the recorded simulator run, rendered', () => {
    const session = simulatorSession(fixture);
    expect(session.output).toContain('simulator:  iOS 27.0');
    for (const theme of ['light', 'dark'] as const) {
      const committed = readFileSync(mediaPath(`simulator-${fixture}`, theme), 'utf8');
      expect(committed).toBe(terminalSvg(session, theme));
    }
  });
});

it('records a launch failure for native-uikit and a launch for the migrated app', () => {
  expect(simulatorSession('native-uikit').output).toContain(
    'Application failed to launch: UIScene life cycle is required for apps built with this SDK.',
  );
  expect(simulatorSession('native-uikit-scenes').output).toContain(
    'running 4 seconds after launch',
  );
});
