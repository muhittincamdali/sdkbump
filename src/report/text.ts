// Text helpers shared by the terminal and Markdown reports.
import type { Ecosystem } from '../rules/data.js';

export const REPOSITORY_URL = 'https://github.com/muhittincamdali/sdkbump';

/** The guide for each kind of project, linked at the end of every report. */
export const GUIDES: Record<Ecosystem, string> = {
  native: `${REPOSITORY_URL}/blob/main/docs/guides/native-ios.md`,
  flutter: `${REPOSITORY_URL}/blob/main/docs/guides/flutter.md`,
  'react-native': `${REPOSITORY_URL}/blob/main/docs/guides/react-native-expo.md`,
  expo: `${REPOSITORY_URL}/blob/main/docs/guides/react-native-expo.md`,
};

export const ECOSYSTEM_LABELS: Record<Ecosystem, string> = {
  native: 'native iOS',
  flutter: 'Flutter',
  'react-native': 'React Native',
  expo: 'Expo',
};

export const LIFECYCLE_LABELS = {
  'app-delegate': 'app delegate life cycle',
  scenes: 'scene life cycle',
  swiftui: 'SwiftUI App (scenes)',
  unknown: 'life cycle not determined',
} as const;

/** How the reports describe a target's Info.plist when it is not a file sdkbump read. */
export const INFO_PLIST_LABELS = {
  generated: 'Info.plist written by Xcode',
  'not-read': 'Info.plist not read',
} as const;

/**
 * Replaces control characters (C0 except tab and newline, DEL, C1) with U+FFFD. File names,
 * versions and plist values come from the checked project; printed raw, an escape sequence in one
 * of them could rewrite the terminal.
 */
export function clean(text: string): string {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: matching control characters is the point.
  return text.replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g, '�');
}

/** A copy of a report (or any part of one) with every string passed through clean(). */
export function withoutControlCharacters<T>(value: T): T {
  if (typeof value === 'string') return clean(value) as T;
  if (Array.isArray(value)) return value.map(withoutControlCharacters) as T;
  if (value === null || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, withoutControlCharacters(item)]),
  ) as T;
}

/** Splits text into lines of at most `width` columns (a longer word gets a line of its own). */
export function wrap(text: string, width: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (line && line.length + 1 + word.length > width) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;
