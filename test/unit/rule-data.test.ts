import { readFileSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  loadRuleData,
  parseRuleData,
  RuleDataError,
  ruleDataJsonSchema,
} from '../../src/rules/data.js';
import { REPLACEMENTS, WINDOW_LOOKUPS } from '../../src/rules/patterns.js';

const root = new URL('../../', import.meta.url);
const raw = () =>
  JSON.parse(readFileSync(new URL('rules/ios27.json', root), 'utf8')) as Record<string, unknown>;

describe('rules/ios27.json', () => {
  const data = loadRuleData();

  it('is valid and has the four v0.1 rules', () => {
    expect(data.rules.map((rule) => rule.id)).toEqual(['SCN001', 'SCN002', 'SCN003', 'SCN004']);
    expect(data.ruleSet).toBe('ios27');
  });

  it('cites an https source for every rule, hook, window lookup, fix and workaround', () => {
    const cited = [
      ...data.rules,
      ...data.hooks,
      ...data.windowLookups,
      ...data.fixes,
      ...data.workarounds,
    ];
    for (const entry of cited) {
      expect(entry.sources.length).toBeGreaterThan(0);
      for (const source of entry.sources) expect(source.url).toMatch(/^https:\/\//);
    }
  });

  it('has a detection pattern for every hook and window lookup, and no pattern without data', () => {
    expect(Object.keys(REPLACEMENTS).sort()).toEqual(data.hooks.map((hook) => hook.id).sort());
    expect(Object.keys(WINDOW_LOOKUPS).sort()).toEqual(
      data.windowLookups.map((lookup) => lookup.id).sort(),
    );
  });

  it('defines every fix the rules ask for', () => {
    const ids = new Set(data.fixes.map((fix) => fix.id));
    const code = ['src/rules/check.ts', 'src/rules/fixes.ts']
      .map((file) => readFileSync(new URL(file, root), 'utf8'))
      .join('\n');
    const asked = [...code.matchAll(/fixById\(\s*data,\s*([^)]*)\)/g)].flatMap((match) =>
      [...(match[1] ?? '').matchAll(/'([a-z0-9-]+)'/g)].map((id) => id[1]),
    );
    expect(asked.length).toBeGreaterThan(10);
    for (const id of asked) expect(ids, `fix ${id}`).toContain(id);
  });

  it('matches rules/schema.json (UPDATE_SCHEMA=1 rewrites it)', () => {
    const file = new URL('rules/schema.json', root);
    const expected = `${JSON.stringify(ruleDataJsonSchema(), null, 2)}\n`;
    if (process.env.UPDATE_SCHEMA) writeFileSync(file, expected);
    expect(readFileSync(file, 'utf8')).toBe(expected);
  });
});

describe('parseRuleData', () => {
  it('rejects a rule without sources', () => {
    const value = raw();
    const rules = value.rules as { sources: unknown[] }[];
    if (rules[0]) rules[0].sources = [];
    expect(() => parseRuleData(value)).toThrow(RuleDataError);
    expect(() => parseRuleData(value)).toThrow(/rules\.0\.sources/);
  });

  it('rejects an http source', () => {
    const value = raw();
    const fixes = value.fixes as { sources: { url: string }[] }[];
    const source = fixes[0]?.sources[0];
    if (source) source.url = 'http://example.org/page';
    expect(() => parseRuleData(value)).toThrow(/fixes\.0\.sources\.0\.url/);
  });

  it('rejects duplicate ids and unknown fields', () => {
    const value = raw();
    const hooks = value.hooks as unknown[];
    hooks.push(hooks[0]);
    expect(() => parseRuleData(value)).toThrow(/Duplicate hook id open-url/);
    expect(() => parseRuleData({ ...raw(), extra: true })).toThrow(RuleDataError);
  });

  it('rejects a guide outside docs/guides', () => {
    const value = raw();
    const fixes = value.fixes as { guide: string }[];
    if (fixes[0]) fixes[0].guide = 'https://example.org/guide';
    expect(() => parseRuleData(value)).toThrow(/fixes\.0\.guide/);
  });
});
