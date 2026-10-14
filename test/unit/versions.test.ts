import { describe, expect, it } from 'vitest';
import {
  atLeast,
  compareVersions,
  lowestAllowed,
  majorOf,
  parseVersion,
} from '../../src/core/versions.js';

describe('parseVersion', () => {
  it('reads release, prerelease and build metadata', () => {
    expect(parseVersion('0.88.0-rc.6')).toEqual({
      major: 0,
      minor: 88,
      patch: 0,
      prerelease: ['rc', '6'],
    });
    expect(parseVersion('v3.41')).toEqual({ major: 3, minor: 41, patch: 0, prerelease: [] });
    expect(parseVersion('1.2.3+build.5')?.patch).toBe(3);
  });

  it.each(['latest', '', '1', 'a.b.c'])('returns null for %j', (text) => {
    expect(parseVersion(text)).toBeNull();
  });
});

describe('compareVersions', () => {
  it.each([
    ['0.87.1', '0.88.0', -1],
    ['0.88.0-rc.6', '0.88.0', -1],
    ['0.88.0-rc.10', '0.88.0-rc.6', 1],
    ['57.0.23', '57.0.23', 0],
    ['57.0.29', '57.0.23', 1],
    ['1.0.0-alpha', '1.0.0-alpha.1', -1],
    ['1.0.0-alpha.beta', '1.0.0-beta', -1],
    ['latest', '1.0.0', -1],
  ])('%s vs %s is %i', (left, right, expected) => {
    expect(compareVersions(left, right)).toBe(expected);
    expect(compareVersions(right, left)).toBe(-expected || 0);
  });

  it('answers atLeast with prereleases below their release', () => {
    expect(atLeast('0.88.0-rc.6', '0.88.0')).toBe(false);
    expect(atLeast('0.88.1', '0.88.0')).toBe(true);
  });
});

describe('lowestAllowed', () => {
  it.each([
    ['0.87.1', '0.87.1'],
    ['^0.87.1', '0.87.1'],
    ['~57.0.29', '57.0.29'],
    ['>=0.88.0-rc.1', '0.88.0-rc.1'],
    ['57.x', '57.0.0'],
    ['57', '57.0.0'],
    ['latest', null],
    ['*', null],
    ['^1 || ^2', null],
    ['<2', null],
    ['github:facebook/react-native', null],
    ['file:../rn', null],
  ])('%s → %s', (range, expected) => {
    expect(lowestAllowed(range)).toBe(expected);
  });
});

describe('majorOf', () => {
  it('returns the major version or null', () => {
    expect(majorOf('57.0.29')).toBe(57);
    expect(majorOf('next')).toBeNull();
  });
});
