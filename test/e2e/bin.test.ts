import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { infoPlist, minimalPbxproj, tree } from '../helpers/tree.js';

// The compiled entry point, as the installed `sdkbump` command runs it (test/setup/build.ts builds it first).
const BIN = fileURLToPath(new URL('../../dist/cli/main.js', import.meta.url));

function sdkbump(cwd: string, ...args: string[]) {
  return spawnSync(process.execPath, [BIN, ...args], {
    cwd,
    encoding: 'utf8',
    env: { PATH: process.env.PATH },
  });
}

describe('dist/cli/main.js', () => {
  it('starts with a node shebang so npx and Homebrew can run it', () => {
    expect(readFileSync(BIN, 'utf8').startsWith('#!/usr/bin/env node\n')).toBe(true);
  });

  it('prints the version from package.json', () => {
    const { version } = JSON.parse(
      readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
    ) as { version: string };
    const result = sdkbump(process.cwd(), '--version');
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe(version);
  });

  it('reads the bundled rule data and exits 1 for an app that fails to launch', () => {
    const root = tree({
      'App.xcodeproj/project.pbxproj': minimalPbxproj(),
      'App/Info.plist': infoPlist(),
      'App/AppDelegate.swift': 'class AppDelegate: UIResponder, UIApplicationDelegate {}',
    });
    const result = sdkbump(root, '--format', 'json');
    expect(result.status).toBe(1);
    const report = JSON.parse(result.stdout);
    expect(report.rules.ruleSet).toBe('ios27');
    expect(report.verdict.code).toBe('fails-to-launch');
  });

  it('exits 2 with a one-line message for a folder without an iOS project', () => {
    const result = sdkbump(tree({ 'notes.txt': 'x' }));
    expect(result.status).toBe(2);
    expect(result.stdout).toBe('');
    expect(result.stderr.trim().split('\n')).toHaveLength(1);
  });
});
