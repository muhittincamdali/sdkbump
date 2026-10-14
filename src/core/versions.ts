// Version numbers as npm and Flutter write them: compare them and find the lowest version a
// declared range (^1.2.3, ~57.0.29, >=0.88.0-rc.1) allows.

export interface Version {
  major: number;
  minor: number;
  patch: number;
  prerelease: string[];
}

const VERSION = /^v?(\d+)\.(\d+)(?:\.(\d+))?(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/;

export function parseVersion(text: string): Version | null {
  const match = VERSION.exec(text.trim());
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3] ?? 0),
    prerelease: match[4] ? match[4].split('.') : [],
  };
}

function comparePrerelease(left: string[], right: string[]): number {
  if (left.length === 0 || right.length === 0) return Math.sign(right.length - left.length);
  for (let index = 0; index < Math.max(left.length, right.length); index++) {
    const a = left[index];
    const b = right[index];
    if (a === undefined) return -1;
    if (b === undefined) return 1;
    const numeric = /^\d+$/.test(a) && /^\d+$/.test(b);
    const order = numeric ? Number(a) - Number(b) : a < b ? -1 : a > b ? 1 : 0;
    if (order !== 0) return Math.sign(order);
  }
  return 0;
}

/** Semantic version order; a prerelease sorts before its release. Unparsable text sorts first. */
export function compareVersions(left: string, right: string): number {
  const a = parseVersion(left);
  const b = parseVersion(right);
  if (!a || !b) return a ? 1 : b ? -1 : 0;
  return (
    Math.sign(a.major - b.major) ||
    Math.sign(a.minor - b.minor) ||
    Math.sign(a.patch - b.patch) ||
    comparePrerelease(a.prerelease, b.prerelease)
  );
}

export const atLeast = (version: string, minimum: string) => compareVersions(version, minimum) >= 0;

/**
 * The lowest version a declared npm range allows, when that can be read without the registry:
 * "0.87.1", "^0.87.1", "~57.0.29", ">=0.88.0-rc.1", "57.x". Returns null for tags ("latest"),
 * "*", URLs, workspace and file references, and ranges with "||" or "<".
 */
export function lowestAllowed(range: string): string | null {
  const text = range.trim();
  if (text.includes('||') || text.includes('<') || /[:/]/.test(text)) return null;
  const match =
    /^(?:\^|~|>=|=)?\s*v?(\d+)(?:\.(\d+|x|\*))?(?:\.(\d+|x|\*))?(-[0-9A-Za-z.-]+)?$/.exec(text);
  if (!match) return null;
  const part = (value: string | undefined) =>
    value === undefined || /[x*]/.test(value) ? '0' : value;
  return `${match[1]}.${part(match[2])}.${part(match[3])}${match[4] ?? ''}`;
}

/** The major version, e.g. 57 for "57.0.29". */
export function majorOf(version: string): number | null {
  return parseVersion(version)?.major ?? null;
}
