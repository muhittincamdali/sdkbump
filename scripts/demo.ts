// Records the README and guide demos as terminal SVGs (light and dark) in docs/media/:
//
// - CLI demos run the built sdkbump on a fixture from the repository root, as a reader would.
// - Simulator sessions replay docs/media/simulator/<fixture>.txt, the output that
//   scripts/simulator-check.sh printed on a Mac; they cannot be recorded in CI.
//
// Run with `npm run demo` (builds first).
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { type Session, terminalSvg } from './terminal-svg.ts';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
export const MEDIA = `${ROOT}docs/media/`;

export interface Demo {
  name: string;
  fixture: string;
  title: string;
  comment: string;
}

export const DEMOS: Demo[] = [
  {
    name: 'rn-087',
    fixture: 'rn-087',
    title: 'sdkbump · React Native 0.87 app',
    comment: '# fixtures/rn-087: `@react-native-community/cli init --version 0.87.1`',
  },
  {
    name: 'flutter',
    fixture: 'flutter-custom-appdelegate',
    title: 'sdkbump · Flutter app with a custom AppDelegate',
    comment: '# fixtures/flutter-custom-appdelegate: Flutter 3.24 template, AppDelegate customised',
  },
  {
    name: 'swiftui',
    fixture: 'native-swiftui',
    title: 'sdkbump · SwiftUI app',
    comment: '# fixtures/native-swiftui: SwiftUI App with an adaptor app delegate',
  },
];

export const SIMULATOR_SESSIONS = ['native-uikit', 'native-uikit-scenes'] as const;

/** Runs the CLI for one demo and returns what a terminal would have shown. */
export function record(demo: Demo): Session {
  const env: NodeJS.ProcessEnv = { ...process.env, FORCE_COLOR: '1' };
  delete env.NO_COLOR;
  let output: string;
  try {
    output = execFileSync(
      process.execPath,
      [`${ROOT}dist/cli/main.js`, `fixtures/${demo.fixture}`],
      {
        cwd: ROOT,
        env,
        encoding: 'utf8',
      },
    );
  } catch (error) {
    // Exit code 1 means findings; the report is still on stdout.
    output = (error as { stdout?: string }).stdout ?? '';
  }
  return {
    title: demo.title,
    comment: demo.comment,
    command: `npx @mcamdali/sdkbump fixtures/${demo.fixture}`,
    output,
  };
}

/** The recorded output of scripts/simulator-check.sh for one fixture, as a session. */
export function simulatorSession(fixture: string): Session {
  const output = readFileSync(`${MEDIA}simulator/${fixture}.txt`, 'utf8')
    // UIKit logs one long line; breaking it before "See" keeps the SVG a readable width.
    .replace(/^(log: {8})(.{80,}?) (See .*)$/m, '$1$2\n            $3');
  return {
    title: `iOS 27 Simulator · ${fixture}`,
    comment: '# recorded on a Mac (Apple silicon) with Xcode 27.0 on 15 October 2026',
    command: `scripts/simulator-check.sh ${fixture}`,
    output,
  };
}

export const mediaPath = (name: string, theme: 'light' | 'dark') =>
  `${MEDIA}demo-${name}-${theme}.svg`;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  mkdirSync(MEDIA, { recursive: true });
  const sessions: [string, Session][] = [
    ...DEMOS.map((demo): [string, Session] => [demo.name, record(demo)]),
    ...SIMULATOR_SESSIONS.map((fixture): [string, Session] => [
      `simulator-${fixture}`,
      simulatorSession(fixture),
    ]),
  ];
  for (const [name, session] of sessions) {
    for (const theme of ['light', 'dark'] as const) {
      writeFileSync(mediaPath(name, theme), terminalSvg(session, theme));
    }
    console.log(`docs/media/demo-${name}-{light,dark}.svg`);
  }
}
