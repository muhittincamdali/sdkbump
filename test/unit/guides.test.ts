import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { GUIDES } from '../../src/report/text.js';
import { loadRuleData } from '../../src/rules/data.js';

const root = new URL('../../', import.meta.url);
const guides = readdirSync(new URL('docs/guides/', root)).filter(
  (file) => file.endsWith('.md') && file !== 'README.md',
);
const prefix = 'https://github.com/muhittincamdali/sdkbump/blob/main/';

describe('guides', () => {
  it('exist for every fix in the rule data', () => {
    for (const fix of loadRuleData().fixes) {
      expect(existsSync(new URL(fix.guide, root)), `${fix.id}: ${fix.guide}`).toBe(true);
    }
  });

  it('exist for the guide link at the end of every report', () => {
    for (const url of Object.values(GUIDES)) {
      expect(url.startsWith(prefix)).toBe(true);
      expect(existsSync(new URL(url.slice(prefix.length), root)), url).toBe(true);
    }
  });

  it('are all listed in docs/guides/README.md and in the documentation site', () => {
    const index = readFileSync(new URL('docs/guides/README.md', root), 'utf8');
    const site = JSON.parse(readFileSync(new URL('docs/site/typedoc.json', root), 'utf8')) as {
      projectDocuments: string[];
    };
    for (const guide of guides) {
      expect(index, guide).toContain(`](${guide})`);
      expect(site.projectDocuments, guide).toContain(`../guides/${guide}`);
    }
  });
});
