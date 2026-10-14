import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const hasJq = spawnSync('jq', ['--version']).status === 0;

describe('examples/api/verdicts.mjs', () => {
  it('imports the built package by name and prints a verdict per fixture', () => {
    const output = execFileSync(process.execPath, ['examples/api/verdicts.mjs'], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    expect(output.trim().split('\n')).toEqual([
      'Shelf (native): Fails to launch when built with the iOS 27 SDK. Rules: SCN001, SCN002, SCN003, SCN004.',
      'Tally (native): Launches; 3 findings to review. Rules: SCN003, SCN004.',
      'flutter_custom (flutter): Fails to launch when built with the iOS 27 SDK. Rules: SCN001, SCN003, SCN004.',
      'expo-57 (expo): Fails to launch when built with the iOS 27 SDK. Rules: SCN001, SCN002, SCN003.',
      'RN087App (react-native): Launches through react-native-uiscene-bridge, a run-time workaround; the app itself does not adopt scenes. Rules: SCN001, SCN002.',
    ]);
  });
});

describe.skipIf(!hasJq)('examples/shell/launch-blockers.sh', () => {
  it('lists the unhandled errors of a fixture', () => {
    const output = execFileSync('sh', ['examples/shell/launch-blockers.sh', 'fixtures/expo-57'], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    expect(output).toBe(
      'ios/expo57/Info.plist SCN001 No scene configuration\nios/expo57/AppDelegate.swift:24 SCN002 Window created in the app delegate\n',
    );
  });

  it('prints nothing when a workaround handles the errors', () => {
    const output = execFileSync(
      'sh',
      ['examples/shell/launch-blockers.sh', 'fixtures/rn-087-bridge'],
      {
        cwd: ROOT,
        encoding: 'utf8',
      },
    );
    expect(output).toBe('');
  });
});

describe('examples/github-actions/sdkbump.yml', () => {
  // The shell of the "Check for the iOS 27 SDK changes" step, with the release tarball replaced by
  // the local build and the checked folder passed as $CHECK. GitHub runs it with `bash -e`.
  const workflow = readFileSync(join(ROOT, 'examples/github-actions/sdkbump.yml'), 'utf8');
  const block = workflow.split('- name: Check for the iOS 27 SDK changes')[1]?.split('\n\n')[0];
  const script = (block ?? '')
    .split('\n')
    .slice(2)
    .map((line) => line.replace(/^ {10}/, ''))
    .join('\n')
    .replace(/npx --yes \S+/, `node ${JSON.stringify(join(ROOT, 'dist/cli/main.js'))} "$CHECK"`);

  const runStep = (check: string) => {
    const cwd = mkdtempSync(join(tmpdir(), 'sdkbump-action-'));
    const summary = join(cwd, 'summary.md');
    const result = spawnSync('bash', ['-e', '-c', script], {
      cwd,
      encoding: 'utf8',
      env: { ...process.env, CHECK: check, GITHUB_STEP_SUMMARY: summary },
    });
    return { status: result.status, summary: readFileSync(summary, 'utf8') };
  };

  it('limits how long the job may run', () => {
    expect(workflow).toMatch(/^ {4}timeout-minutes: 10$/m);
  });

  it('replaces only the tarball command', () => {
    expect(script).toContain('|| status=$?');
    expect(script).toContain('exit "$status"');
  });

  it('adds the report to the summary and fails the job on errors', () => {
    const { status, summary } = runStep(join(ROOT, 'fixtures/native-uikit'));
    expect(status).toBe(1);
    expect(summary).toMatch(/^## sdkbump: Shelf \(native iOS\)/);
  });

  it('keeps exit code 2 when sdkbump writes no report', () => {
    const { status, summary } = runStep(mkdtempSync(join(tmpdir(), 'sdkbump-empty-')));
    expect(status).toBe(2);
    expect(summary).toBe('sdkbump exited with 2 and wrote no report; see the step log.\n');
  });
});
