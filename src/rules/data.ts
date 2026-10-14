// The rule data (rules/ios27.json): what each rule says, the fixes and workarounds sdkbump can
// suggest, and the source every statement rests on. Validated with zod when loaded; the JSON
// schema in rules/schema.json is generated from the same definition.
import { readFileSync } from 'node:fs';
import { z } from 'zod';

const Source = z
  .object({
    title: z.string().min(1),
    url: z.url({ protocol: /^https$/ }),
  })
  .strict();

const Ecosystem = z.enum(['native', 'flutter', 'react-native', 'expo']);
/** The rules of this rule set. */
export const RULE_IDS = ['SCN001', 'SCN002', 'SCN003', 'SCN004'] as const;
export type RuleId = (typeof RULE_IDS)[number];
/** Severities, highest first. */
export const SEVERITIES = ['error', 'warning', 'info'] as const;
export type Severity = (typeof SEVERITIES)[number];

const RuleIdSchema = z.enum(RULE_IDS);
const SeveritySchema = z.enum(SEVERITIES);
/** Every rule, hook, lookup, fix and workaround cites at least one source. */
const Sources = z.array(Source).min(1);

const Rule = z
  .object({
    id: RuleIdSchema,
    severity: SeveritySchema,
    title: z.string().min(1),
    summary: z.string().min(1),
    sources: Sources,
  })
  .strict();

const Hook = z
  .object({
    id: z.string().regex(/^[a-z-]+$/),
    kind: z.enum(['method', 'launch-option']),
    swift: z.string().min(1),
    objc: z.string().min(1),
    replacement: z.string().min(1),
    swiftUI: z.string().nullable(),
    sources: Sources,
  })
  .strict();

const WindowLookup = z
  .object({
    id: z.string().regex(/^[a-z-]+$/),
    title: z.string().min(1),
    api: z.string().min(1),
    message: z.string().min(1),
    sources: Sources,
  })
  .strict();

const Fix = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    ecosystems: z.array(Ecosystem).min(1),
    title: z.string().min(1),
    steps: z.array(z.string().min(1)).min(1),
    guide: z.string().regex(/^docs\/guides\/[a-z0-9-]+\.md$/),
    sources: Sources,
  })
  .strict();

const Workaround = z
  .object({
    package: z.string().min(1),
    ecosystems: z.array(Ecosystem).min(1),
    mitigates: z.array(RuleIdSchema).min(1),
    summary: z.string().min(1),
    limits: z.array(z.string().min(1)),
    sources: Sources,
  })
  .strict();

const Version = z.string().regex(/^\d+\.\d+\.\d+$/);
const Sha256 = z.string().regex(/^[0-9a-f]{64}$/);

export const RuleDataSchema = z
  .object({
    $schema: z.string().optional(),
    ruleSet: z.string().regex(/^[a-z0-9]+$/),
    /** Date of the last change, YYYY.MM.DD. */
    dataVersion: z.string().regex(/^\d{4}\.\d{2}\.\d{2}$/),
    sdk: z.string().min(1),
    rules: z.array(Rule).min(1),
    hooks: z.array(Hook).min(1),
    windowLookups: z.array(WindowLookup).min(1),
    fixes: z.array(Fix).min(1),
    workarounds: z.array(Workaround),
    milestones: z
      .object({
        reactNativeScenes: Version,
        expoSceneSupport: Version,
        expoBuildProperties: Version,
        expoScenesByDefault: Version,
        flutterAutoMigration: Version,
      })
      .strict(),
    /** Scene delegate base classes that pass scene events on to the app delegate. */
    sceneForwarders: z.array(z.string().min(1)),
    /** SHA-256 of the trimmed AppDelegate files Flutter's migrator recognises as unmodified. */
    flutterTemplates: z
      .object({
        source: z.url({ protocol: /^https$/ }),
        swift: z.array(Sha256).min(1),
        objcHeader: Sha256,
        objcImplementation: Sha256,
      })
      .strict(),
  })
  .strict()
  .superRefine((data, context) => {
    const unique = (label: string, ids: string[]) => {
      const seen = new Set<string>();
      for (const id of ids) {
        if (seen.has(id))
          context.addIssue({ code: 'custom', message: `Duplicate ${label} id ${id}` });
        seen.add(id);
      }
    };
    unique(
      'rule',
      data.rules.map((rule) => rule.id),
    );
    unique(
      'hook',
      data.hooks.map((hook) => hook.id),
    );
    unique(
      'window lookup',
      data.windowLookups.map((lookup) => lookup.id),
    );
    unique(
      'fix',
      data.fixes.map((fix) => fix.id),
    );
  });

export type RuleData = z.infer<typeof RuleDataSchema>;
export type Ecosystem = z.infer<typeof Ecosystem>;
export type RuleSource = z.infer<typeof Source>;
export type RuleDefinition = z.infer<typeof Rule>;
export type HookDefinition = z.infer<typeof Hook>;
export type WindowLookupDefinition = z.infer<typeof WindowLookup>;
export type FixDefinition = z.infer<typeof Fix>;
export type WorkaroundDefinition = z.infer<typeof Workaround>;

export class RuleDataError extends Error {
  override name = 'RuleDataError';
}

/** Validates rule data; throws RuleDataError listing every problem. */
export function parseRuleData(value: unknown): RuleData {
  const result = RuleDataSchema.safeParse(value);
  if (result.success) return result.data;
  const problems = result.error.issues.map(
    (issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`,
  );
  throw new RuleDataError(`Invalid rule data:\n${problems.join('\n')}`);
}

let cached: RuleData | undefined;

/** The bundled rules/ios27.json (one level above src/ and dist/). */
export function loadRuleData(): RuleData {
  cached ??= parseRuleData(
    JSON.parse(readFileSync(new URL('../../rules/ios27.json', import.meta.url), 'utf8')),
  );
  return cached;
}

/** JSON schema of the rule data, written to rules/schema.json. */
export function ruleDataJsonSchema(): unknown {
  return z.toJSONSchema(RuleDataSchema, { io: 'input', unrepresentable: 'any' });
}
