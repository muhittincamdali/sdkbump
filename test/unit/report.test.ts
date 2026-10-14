import { stripVTControlCharacters } from 'node:util';
import { describe, expect, it } from 'vitest';
import type { FixAdvice, Finding, Report } from '../../src/model.js';
import { FORMATS, render } from '../../src/report/index.js';
import { clean, wrap } from '../../src/report/text.js';

const source = {
  title: 'Apple: Transitioning',
  url: 'https://developer.apple.com/documentation/uikit',
};
const fix = (id: string, title: string): FixAdvice => ({
  id,
  title,
  steps: [
    `Step one of ${title}.`,
    'Step two, which is long enough to be wrapped onto a second line of the report.',
  ],
  guide: `https://github.com/muhittincamdali/sdkbump/blob/main/docs/guides/${id}.md`,
  sources: [source],
});

const finding = (overrides: Partial<Finding>): Finding => ({
  rule: 'SCN001',
  severity: 'error',
  title: 'No scene configuration',
  message: 'Info.plist has no UIApplicationSceneManifest.',
  file: 'App/Info.plist',
  line: null,
  target: 'App',
  owner: 'app',
  fix: fix('adopt', 'Adopt a scene delegate'),
  alternatives: [],
  mitigation: null,
  sources: [source],
  ...overrides,
});

const report = (findings: Finding[], overrides: Partial<Report> = {}): Report => ({
  schemaVersion: 0,
  tool: { name: 'sdkbump', version: '0.1.0' },
  rules: { ruleSet: 'ios27', dataVersion: '2026.10.15', sdk: 'iOS 27.0 SDK' },
  project: {
    path: 'fixtures/app',
    name: 'App',
    ecosystem: 'react-native',
    versions: [{ name: 'react-native', version: '0.87.1', source: 'declared' }],
    targets: [{ name: 'App', lifecycle: 'app-delegate', infoPlists: ['App/Info.plist'] }],
  },
  verdict: { code: 'fails-to-launch', text: 'Fails to launch when built with the iOS 27 SDK.' },
  findings,
  notes: [],
  summary: {
    errors: findings.filter((item) => item.severity === 'error' && !item.mitigation).length,
    warnings: findings.filter((item) => item.severity === 'warning' && !item.mitigation).length,
    info: 0,
    mitigated: findings.filter((item) => item.mitigation).length,
  },
  ...overrides,
});

const sample = report([
  finding({ alternatives: [fix('bridge', 'Temporary: install a bridge')] }),
  finding({
    rule: 'SCN002',
    title: 'Window created in the app delegate',
    message: 'AppDelegate creates the window with UIWindow(frame:).',
    file: 'App/AppDelegate.swift',
    line: 12,
    fix: fix('adopt', 'Adopt a scene delegate'),
  }),
  finding({
    rule: 'SCN003',
    severity: 'warning',
    title: 'application(_:open:options:) is not called with scenes',
    file: 'App/AppDelegate.swift',
    line: 30,
    fix: fix('move', 'Move it to the scene delegate'),
    mitigation: {
      package: 'react-native-uiscene-bridge',
      version: '0.1.0',
      summary: 'Adds a scene configuration at run time.',
      limits: ['One window.'],
      sources: [source],
    },
  }),
]);

describe('render (tty)', () => {
  it('prints the verdict, each finding and each fix once', () => {
    expect(render(sample, 'tty', { color: false })).toMatchSnapshot();
  });

  it('colours only when asked, and the text is the same without the codes', () => {
    const plain = render(sample, 'tty', { color: false });
    const coloured = render(sample, 'tty', { color: true });
    expect(plain).not.toContain('\u001b[');
    expect(coloured).toContain('\u001b[31m');
    expect(stripVTControlCharacters(coloured)).toBe(plain);
  });

  it('keeps every line within the width', () => {
    for (const width of [60, 80, 100]) {
      const lines = render(sample, 'tty', { color: false, width }).split('\n');
      const tooLong = lines.filter((line) => line.length > width && !line.includes('https://'));
      expect(tooLong, `width ${width}`).toEqual([]);
    }
  });

  it('says what was checked when there are no findings', () => {
    const text = render(
      report([], {
        verdict: { code: 'no-findings', text: 'No findings for the checks in ios27@2026.10.15.' },
      }),
      'tty',
      { color: false },
    );
    expect(text).toContain('0 errors, 0 warnings');
    expect(text).toContain('#what-sdkbump-checks');
    expect(text).not.toContain('How to fix');
  });

  it('replaces control characters from the project before printing', () => {
    const hostile = report([finding({ file: 'App/\u001b[2JInfo.plist', title: 'x\u0007' })], {
      notes: ['bad \u009b name'],
    });
    const text = render(hostile, 'tty', { color: false });
    // biome-ignore lint/suspicious/noControlCharactersInRegex: the test is that none are left.
    expect(text).not.toMatch(/[\u0007\u001b\u009b]/);
    expect(text).toContain('App/�[2JInfo.plist');
  });
});

describe('render (markdown)', () => {
  it('has a table, the details and the footer', () => {
    expect(render(sample, 'markdown')).toMatchSnapshot();
  });

  it('escapes pipes, HTML and backticks from the project', () => {
    const text = render(
      report([finding({ file: 'a|b`c.plist', message: 'x | y <script>' })], {
        project: { ...sample.project, name: 'App <b>|' },
      }),
      'markdown',
    );
    expect(text).toContain('## sdkbump: App &lt;b>\\| (React Native)');
    expect(text).toContain('`` a|b`c.plist ``');
    expect(text).toContain('x \\| y &lt;script>');
  });
});

describe('render (json)', () => {
  it('is the report as-is', () => {
    expect(JSON.parse(render(sample, 'json'))).toEqual(sample);
  });

  it('lists the formats the CLI accepts', () => {
    expect(FORMATS).toEqual(['tty', 'markdown', 'json']);
  });
});

describe('text helpers', () => {
  it('wraps on spaces and keeps long words whole', () => {
    expect(wrap('one two three four', 9)).toEqual(['one two', 'three', 'four']);
    expect(wrap('https://example.org/a/very/long/path short', 10)).toEqual([
      'https://example.org/a/very/long/path',
      'short',
    ]);
  });

  it('keeps tabs and newlines but replaces other control characters', () => {
    expect(clean('a\tb\nc\u0000d\u007fe')).toBe('a\tb\nc�d�e');
  });
});
