export interface VerifiedPDFSource {
  readonly document: 'open00 v1.5 PDF';
  readonly page: number;
  readonly anchor: string;
  readonly hash: string;
  readonly verifiedBy: string;
  readonly verifiedAt: string;
}

export interface OptionalRuleDefinition {
  readonly id: `open00.optional.${string}`;
  readonly name: string;
  readonly hint: string;
  readonly source: VerifiedPDFSource;
}

export interface FoundryWorldSettings {
  register(namespace: string, key: string, data: { readonly name: string; readonly hint: string; readonly scope: 'world'; readonly config: true; readonly type: BooleanConstructor; readonly default: false }): void;
}

export interface OptionalRuleRegistry {
  readonly options: readonly OptionalRuleDefinition[];
  defaults(): Readonly<Record<string, false>>;
  isEnabled(settings: Readonly<Record<string, unknown>>, id: string): boolean;
}

const optionId = /^open00\.optional\.[a-z0-9-]+(?:\.[a-z0-9-]+)*$/;
const hash = /^[a-f0-9]{64}$/;
const validSource = (source: VerifiedPDFSource): boolean => source.document === 'open00 v1.5 PDF' && Number.isInteger(source.page) && source.page > 0 && source.anchor.length > 0 && hash.test(source.hash) && source.verifiedBy.length > 0 && source.verifiedAt.length > 0;

export function createOptionalRuleRegistry(options: readonly OptionalRuleDefinition[]): OptionalRuleRegistry {
  const ids = new Set<string>();
  for (const option of options) {
    if (!optionId.test(option.id) || option.name.length === 0 || option.hint.length === 0 || !validSource(option.source)) throw new Error('Each optional rule requires a verified PDF source and stable open00.optional id.');
    if (ids.has(option.id)) throw new Error(`Duplicate optional rule id: ${option.id}`);
    ids.add(option.id);
  }
  const snapshot = options.map((option) => structuredClone(option));
  return {
    options: snapshot,
    defaults: () => Object.fromEntries(snapshot.map((option) => [option.id, false])) as Readonly<Record<string, false>>,
    isEnabled: (settings, id) => ids.has(id) && settings[id] === true,
  };
}

/** Deliberately empty until every published option has item-level PDF verification. */
export const optionalRuleRegistry = createOptionalRuleRegistry([]);

export function registerOptionalRuleSettings(settings: FoundryWorldSettings, registry: OptionalRuleRegistry = optionalRuleRegistry): void {
  for (const option of registry.options) {
    settings.register('open00', option.id.slice('open00.'.length), { name: option.name, hint: option.hint, scope: 'world', config: true, type: Boolean, default: false });
  }
}

export function settingsRegistrationReceipt({ version, runtimeAvailable }: { readonly version?: string; readonly runtimeAvailable: boolean }): { readonly status: 'NOT VERIFIED'; readonly reason: string } {
  if (version !== '14.367') return { status: 'NOT VERIFIED', reason: 'Foundry build must be exactly 14.367' };
  if (!runtimeAvailable) return { status: 'NOT VERIFIED', reason: 'Foundry runtime registration evidence is unavailable' };
  return { status: 'NOT VERIFIED', reason: 'Node contracts cannot replace a captured Foundry runtime registration receipt' };
}
