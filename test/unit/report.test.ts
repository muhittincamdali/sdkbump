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
    targets: [
      {
        name: 'App',
        lifecycle: 'app-delegate',
        infoPlists: ['App/Info.plist'],
        infoPlistSource: 'file',
      },
    ],
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

  const WJ = '\u2060';
  const withName = (name: string, overrides: Partial<Finding> = {}) =>
    render(report([finding(overrides)], { project: { ...sample.project, name } }), 'markdown');
  const heading = (text: string) => text.split('\n')[0];

  it('escapes pipes and HTML from the project', () => {
    const text = withName('App <b>|', { message: 'x | y <img src=x onerror=alert(1)>' });
    expect(heading(text)).toBe('## sdkbump: App \\<b\\>\\| (React Native)');
    expect(text).toContain('x \\| y \\<img src=x onerror=alert\\(1\\)\\>');
    expect(text).not.toMatch(/(?<!\\)<(img|b)/);
  });

  it('keeps an image or a link in the project name as text', () => {
    expect(heading(withName('![t](https://evil.example/p.png)'))).toBe(
      `## sdkbump: \\!\\[t\\]\\(https${WJ}://evil.example/p.png\\) (React Native)`,
    );
    const text = withName('App', { title: '[click](javascript:alert(1))' });
    expect(text).toContain('| \\[click\\]\\(javascript:alert\\(1\\)\\) |');
    expect(text).not.toContain('](javascript');
  });

  it('stops bare URLs, www addresses, e-mail addresses and mentions from becoming links', () => {
    const text = withName('App', {
      message:
        'see https://evil.example, http://x.example, www.evil.example and admin@evil.example @team',
    });
    expect(text).toContain(
      `see https${WJ}://evil.example, http${WJ}://x.example, www${WJ}.evil.example and admin@${WJ}evil.example @${WJ}team`,
    );
    expect(text).not.toMatch(/https?:\/\/evil|www\.evil|@evil|@team/);
  });

  it('stops URLs and www addresses right after a letter or an underscore from becoming links', () => {
    const text = withName('_https://evil.example/a x_www.evil.example Xhttp://evil.example/b');
    expect(heading(text)).toBe(
      `## sdkbump: \\_https${WJ}://evil.example/a x\\_www${WJ}.evil.example Xhttp${WJ}://evil.example/b (React Native)`,
    );
    expect(text).not.toMatch(/https?:\/\/evil|www\.evil/);
  });

  it('stops issue references from becoming links', () => {
    const text = withName('App', { message: 'see #1, owner/repo#2 and GH-3' });
    expect(text).toContain(`see \\#${WJ}1, owner/repo\\#${WJ}2 and GH${WJ}-3`);
    expect(text).not.toMatch(/#\d|GH-\d/);
  });

  it('keeps a value at the start of a line from opening a list, a code block or a rule', () => {
    const notes = ['- injected item', '+ injected', '12. injected', '    indented code', '---'];
    const text = render(report([finding({})], { notes }), 'markdown');
    expect(text).toContain('> \\- injected item\n');
    expect(text).toContain('> \\+ injected\n');
    expect(text).toContain('> 12\\. injected\n');
    expect(text).toContain('> indented code\n');
    expect(text).toContain('> \\---\n');
  });

  it('keeps headings, emphasis and line breaks in a value inline', () => {
    const text = withName('# Owned\n\n## Again', { title: '*bold* _it_ ~~gone~~ `x`' });
    expect(heading(text)).toBe('## sdkbump: \\# Owned \\#\\# Again (React Native)');
    expect(text).toContain('| \\*bold\\* \\_it\\_ \\~\\~gone\\~\\~ \\`x\\` |');
    expect(text).not.toMatch(/^#{1,2} (Owned|Again)/m);
  });

  it('makes the code fence longer than any backtick run in a file name', () => {
    const text = withName('App', { file: 'a``b`c.plist' });
    expect(text).toContain('| ```a``b`c.plist``` |');
    expect(withName('App', { file: '`x' })).toContain('`` `x ``');
    expect(withName('App', { file: 'Info.plist' })).toContain('| `Info.plist` |');
  });

  it('escapes a pipe in a file name inside the table only', () => {
    const text = withName('App', { file: 'a|b.plist' });
    expect(text).toContain('| `a\\|b.plist` |');
    expect(text).toContain('`a|b.plist`: Info.plist');
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

describe('render (control characters from the project)', () => {
  const ESCAPES = {
    'CSI clear screen': '\u001b[2J\u001b[H',
    'OSC 8 hyperlink': '\u001b]8;;https://evil.example/\u0007Click here\u001b]8;;\u0007',
    'OSC 52 clipboard': '\u001b]52;c;cm0gLXJmIH4K\u0007',
    'C1 CSI (U+009B)': '\u009b31mRED',
    'DEL and C1 OSC/ST': '\u007f\u009d52;c;eA==\u009c',
  };
  // biome-ignore lint/suspicious/noControlCharactersInRegex: the test is that none are left.
  const CONTROL = /[\u0000-\u0008\u000b-\u001f\u007f-\u009f]/;
  // The colour codes sdkbump writes itself: ESC [ <number> m.
  const OWN_COLOURS = new RegExp(`${String.fromCharCode(27)}\\[\\d+m`, 'g');
  // A target sdkbump could not read the Info.plist of: its name is also in the verdict.
  const hostile = (payload: string): Report =>
    report([finding({ file: `App${payload}/Info.plist`, target: `App${payload}` })], {
      project: {
        ...sample.project,
        name: `App${payload}`,
        versions: [{ name: 'react-native', version: `0.87.1${payload}`, source: 'declared' }],
        targets: [
          {
            name: `App${payload}`,
            lifecycle: 'unknown',
            infoPlists: [],
            infoPlistSource: 'not-read',
          },
        ],
      },
      verdict: {
        code: 'unknown',
        text: `Launch not determined: sdkbump could not read the Info.plist of App${payload}.`,
      },
      notes: [`App${payload}: INFOPLIST_FILE is not read.`],
    });

  for (const [name, payload] of Object.entries(ESCAPES)) {
    it(`replaces ${name} in every format, the verdict included`, () => {
      const tty = render(hostile(payload), 'tty', { color: false });
      expect(tty).not.toMatch(CONTROL);
      expect(tty).toContain('Launch not determined: sdkbump could not read the Info.plist of');
      const coloured = render(hostile(payload), 'tty', { color: true });
      expect(coloured.replace(OWN_COLOURS, '')).not.toMatch(CONTROL);
      expect(render(hostile(payload), 'markdown')).not.toMatch(CONTROL);
      const json = render(hostile(payload), 'json');
      expect(json).not.toMatch(CONTROL);
      expect(JSON.parse(json).verdict.text).toContain('�');
    });
  }

  it('does not change the report it is given', () => {
    const input = hostile(ESCAPES['OSC 52 clipboard']);
    render(input, 'json');
    expect(input.verdict.text).toContain('\u001b]52;');
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
