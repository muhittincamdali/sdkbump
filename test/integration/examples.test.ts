import { execFileSync, spawnSync } from 'node:child_process';
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
