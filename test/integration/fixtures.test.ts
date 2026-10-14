import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { run } from '../../src/cli/run.js';
import type { Report, VerdictCode } from '../../src/model.js';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

/** Runs the CLI from the repository root, as the README examples do, and returns stdout. */
async function sdkbump(...args: string[]): Promise<{ code: number; stdout: string }> {
  let stdout = '';
  const code = await run(args, {
    cwd: ROOT,
    env: {},
    stdout: (text) => {
      stdout += text;
    },
    stderr: () => {},
    stdoutIsTty: false,
  });
  return { code, stdout };
}

interface Expected {
  verdict: VerdictCode;
  /** rule, file:line (or file), fix id; "handled" marks findings a workaround handles. */
  findings: string[];
  exitCode: number;
}

const EXPECTED: Record<string, Expected> = {
  'native-uikit': {
    verdict: 'fails-to-launch',
    exitCode: 1,
    findings: [
      'SCN001 Shelf/Info.plist native-adopt-scenes',
      'SCN002 Shelf/AppDelegate.swift:12 native-window-in-scene',
      'SCN003 Shelf/AppDelegate.swift:18 native-move-hook',
      'SCN003 Shelf/AppDelegate.swift:21 native-move-hook',
      'SCN003 Shelf/AppDelegate.swift:29 native-move-hook',
      'SCN003 Shelf/AppDelegate.swift:38 native-move-hook',
      'SCN003 Shelf/AppDelegate.swift:48 native-move-hook',
      'SCN003 Shelf/AppDelegate.swift:56 native-move-hook',
      'SCN003 Shelf/AppDelegate.swift:60 native-move-hook',
      'SCN004 Shelf/Router.swift:35 window-from-scene',
      'SCN004 Shelf/Router.swift:36 window-from-scene',
    ],
  },
  'native-uikit-scenes': { verdict: 'no-findings', exitCode: 0, findings: [] },
  'native-swiftui': {
    verdict: 'review',
    exitCode: 0,
    findings: [
      'SCN003 Tally/TallyApp.swift:26 swiftui-modifier',
      'SCN003 Tally/TallyApp.swift:35 swiftui-modifier',
      'SCN004 Tally/ContentView.swift:38 window-from-scene',
    ],
  },
  'flutter-custom-appdelegate': {
    verdict: 'fails-to-launch',
    exitCode: 1,
    findings: [
      'SCN001 ios/Runner/Info.plist flutter-manual-migration',
      'SCN003 ios/Runner/AppDelegate.swift:28 flutter-scene-delegate-hooks',
      'SCN004 ios/Runner/AppDelegate.swift:10 flutter-engine-bridge',
      'SCN004 ios/Runner/AppDelegate.swift:34 flutter-engine-bridge',
    ],
  },
  'expo-57': {
    verdict: 'fails-to-launch',
    exitCode: 1,
    findings: [
      'SCN001 ios/expo57/Info.plist expo-57-scene-support',
      'SCN002 ios/expo57/AppDelegate.swift:24 expo-57-scene-support',
      'SCN003 ios/expo57/AppDelegate.swift:35 expo-57-scene-support',
      'SCN003 ios/expo57/AppDelegate.swift:44 expo-57-scene-support',
    ],
  },
  'rn-087': {
    verdict: 'fails-to-launch',
    exitCode: 1,
    findings: [
      'SCN001 ios/RN087App/Info.plist rn-upgrade-088',
      'SCN002 ios/RN087App/AppDelegate.swift:24 rn-upgrade-088',
    ],
  },
  'rn-087-bridge': {
    verdict: 'launches-through-workaround',
    exitCode: 0,
    findings: [
      'SCN001 ios/RN087App/Info.plist rn-upgrade-088 handled',
      'SCN002 ios/RN087App/AppDelegate.swift:24 rn-upgrade-088 handled',
    ],
  },
  'rn-088-rc': { verdict: 'no-findings', exitCode: 0, findings: [] },
  'expo-58': { verdict: 'no-findings', exitCode: 0, findings: [] },
};

const summarize = (report: Report) =>
  report.findings.map((item) =>
    [
      item.rule,
      `${item.file}${item.line ? `:${item.line}` : ''}`,
      item.fix?.id,
      ...(item.mitigation ? ['handled'] : []),
    ].join(' '),
  );

describe.each(Object.entries(EXPECTED))('fixtures/%s', (name, expected) => {
  const path = `fixtures/${name}`;

  it('has the expected findings, verdict and exit code', async () => {
    const { code, stdout } = await sdkbump(path, '--format', 'json');
    const report = JSON.parse(stdout) as Report;
    expect(summarize(report)).toEqual(expected.findings);
    expect(report.verdict.code).toBe(expected.verdict);
    expect(code).toBe(expected.exitCode);
  });

  it.each(['tty', 'markdown', 'json'] as const)(
    'matches the recorded %s report',
    async (format) => {
      const extension = { tty: 'txt', markdown: 'md', json: 'json' }[format];
      const { stdout } = await sdkbump(path, '--format', format);
      await expect(stdout).toMatchFileSnapshot(`../__snapshots__/fixtures/${name}.${extension}`);
    },
  );
});

it('covers the six projects of the v0.1 acceptance list, plus three that adopt scenes', () => {
  const required = [
    'native-uikit',
    'native-swiftui',
    'flutter-custom-appdelegate',
    'expo-57',
    'rn-087',
    'rn-087-bridge',
  ];
  for (const name of required) expect(Object.keys(EXPECTED)).toContain(name);
  expect(Object.values(EXPECTED).filter((item) => item.findings.length === 0)).toHaveLength(3);
});
