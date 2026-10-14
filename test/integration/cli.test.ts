import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { type CliEnvironment, EXIT, run } from '../../src/cli/run.js';
import { infoPlist, minimalPbxproj, sceneManifest, tree } from '../helpers/tree.js';

interface Result {
  code: number;
  stdout: string;
  stderr: string;
}

async function sdkbump(
  args: string[],
  cwd: string,
  env: Partial<CliEnvironment> = {},
): Promise<Result> {
  let stdout = '';
  let stderr = '';
  const code = await run(args, {
    cwd,
    env: {},
    stdout: (text) => {
      stdout += text;
    },
    stderr: (text) => {
      stderr += text;
    },
    stdoutIsTty: false,
    ...env,
  });
  return { code, stdout, stderr };
}

const app = (plist: string, delegate: string) =>
  tree({
    'App.xcodeproj/project.pbxproj': minimalPbxproj(),
    'App/Info.plist': infoPlist(plist),
    'App/AppDelegate.swift': delegate,
  });

const failing = () => app('', 'class AppDelegate: UIResponder, UIApplicationDelegate {}');
const warningOnly = () =>
  app(
    sceneManifest(),
    'class AppDelegate: UIResponder, UIApplicationDelegate {\n  func applicationDidBecomeActive(_ application: UIApplication) {}\n}',
  );

describe('sdkbump (in process)', () => {
  it('checks the current folder by default and exits 1 on an error finding', async () => {
    const result = await sdkbump([], failing());
    expect(result.code).toBe(EXIT.findings);
    expect(result.stdout).toContain('Fails to launch when built with the iOS 27 SDK.');
    expect(result.stdout).toContain(' · native iOS · .');
    expect(result.stderr).toBe('');
  });

  it('takes a path relative to the working folder and shows it as given', async () => {
    const root = failing();
    const result = await sdkbump(['App.xcodeproj'], root);
    expect(result.stdout).toContain(' · native iOS · App.xcodeproj');
  });

  it('exits 0 on warnings unless --fail-on asks for them', async () => {
    const root = warningOnly();
    expect((await sdkbump([], root)).code).toBe(EXIT.ok);
    expect((await sdkbump(['--fail-on', 'warning'], root)).code).toBe(EXIT.findings);
    expect((await sdkbump(['--fail-on', 'none'], failing())).code).toBe(EXIT.ok);
  });

  it('writes JSON and Markdown', async () => {
    const json = JSON.parse((await sdkbump(['--format', 'json'], failing())).stdout);
    expect(json.findings[0].rule).toBe('SCN001');
    expect(json.project.path).toBe('.');
    const markdown = (await sdkbump(['-f', 'markdown'], failing())).stdout;
    expect(markdown).toMatch(/^## sdkbump: App \(native iOS\)/);
  });

  it('writes the report to --output and says so on stderr', async () => {
    const root = failing();
    const result = await sdkbump(['--output', 'report.md', '--format', 'markdown'], root);
    expect(result.stdout).toBe('');
    expect(result.stderr).toBe(
      'Wrote report.md: Fails to launch when built with the iOS 27 SDK.\n',
    );
    expect(readFileSync(join(root, 'report.md'), 'utf8')).toContain('| SCN001 | error |');
  });

  it('colours a terminal unless NO_COLOR or --no-color, and FORCE_COLOR forces it', async () => {
    const root = failing();
    const tty = { stdoutIsTty: true, columns: 120 };
    expect((await sdkbump([], root, tty)).stdout).toContain('\u001b[');
    expect((await sdkbump(['--no-color'], root, tty)).stdout).not.toContain('\u001b[');
    expect((await sdkbump([], root, { ...tty, env: { NO_COLOR: '1' } })).stdout).not.toContain(
      '\u001b[',
    );
    expect((await sdkbump([], root, { env: { FORCE_COLOR: '1' } })).stdout).toContain('\u001b[');
    expect(
      (await sdkbump(['-f', 'json'], root, { env: { FORCE_COLOR: '1' } })).stdout,
    ).not.toContain('\u001b[');
  });

  it('wraps to a narrow terminal', async () => {
    const lines = (
      await sdkbump(['--no-color'], failing(), { stdoutIsTty: true, columns: 64 })
    ).stdout.split('\n');
    expect(lines.filter((line) => line.length > 64 && !line.includes('https://'))).toEqual([]);
  });

  it('exits 2 with a message when there is no iOS project', async () => {
    const result = await sdkbump([], tree({ 'README.md': '# not an app' }));
    expect(result.code).toBe(EXIT.error);
    expect(result.stdout).toBe('');
    expect(result.stderr).toMatch(/^sdkbump: No iOS project found in /);
    expect(result.stderr).not.toContain('bug');
  });

  it('exits 2 on bad arguments', async () => {
    const result = await sdkbump(['--format', 'xml'], failing());
    expect(result.code).toBe(EXIT.error);
    expect(result.stderr).toContain("argument 'xml' is invalid");
  });

  it('prints help and the version with exit code 0', async () => {
    const help = await sdkbump(['--help'], failing());
    expect(help.code).toBe(EXIT.ok);
    expect(help.stdout).toContain('Exit codes:');
    const version = await sdkbump(['--version'], failing());
    const manifest = JSON.parse(
      readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
    );
    expect(version.stdout.trim()).toBe(manifest.version);
  });
});
