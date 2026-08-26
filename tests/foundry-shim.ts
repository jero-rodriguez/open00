/**
 * Foundry VTT Runtime Shim for Vitest
 *
 * Provides minimal implementations of Foundry's global classes and data fields
 * so that TypeDataModels (CharacterDataModel, NpcDataModel) and Document
 * subclasses (Open00Actor, Open00Item) can be instantiated and tested in a
 * vitest environment without a running Foundry server.
 *
 * This file is loaded as a vitest setupFile BEFORE any test imports, ensuring
 * globalThis.foundry is populated when models destructure field classes at
 * module evaluation time.
 */

// =============================================================================
// Data Fields — minimal constructable stubs that store options + initial values
// =============================================================================

class DataField {
  options: Record<string, unknown>;

  constructor(options: Record<string, unknown> = {}) {
    this.options = options;
  }

  /** Return the field's initial value. */
  getInitialValue(): unknown {
    return this.options.initial ?? undefined;
  }
}

class NumberField extends DataField {
  override getInitialValue(): number {
    return (this.options.initial as number) ?? 0;
  }
}

class StringField extends DataField {
  override getInitialValue(): string {
    return (this.options.initial as string) ?? '';
  }
}

class BooleanField extends DataField {
  override getInitialValue(): boolean {
    return (this.options.initial as boolean) ?? false;
  }
}

class HTMLField extends DataField {
  override getInitialValue(): string {
    return (this.options.initial as string) ?? '';
  }
}

class ArrayField extends DataField {
  element: DataField;

  constructor(element: DataField, options: Record<string, unknown> = {}) {
    super(options);
    this.element = element;
  }

  override getInitialValue(): unknown[] {
    return (this.options.initial as unknown[]) ?? [];
  }
}

class SchemaField extends DataField {
  fields: Record<string, DataField>;

  constructor(fields: Record<string, DataField>, options: Record<string, unknown> = {}) {
    super(options);
    this.fields = fields;
  }

  override getInitialValue(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, field] of Object.entries(this.fields)) {
      result[key] = (field as any).getInitialValue();
    }
    return result;
  }
}

// =============================================================================
// TypeDataModel — base class that models extend. Runs schema initialization
// and calls prepareDerivedData() on construction.
// =============================================================================

class TypeDataModel {
  parent?: any;

  /**
   * Shim constructor — intentionally does NOT assign schema data here.
   * In real Foundry, TypeDataModel construction happens within the Document
   * lifecycle which handles field initialization differently. In our test shim,
   * use the exported `createModel()` factory which assigns data AFTER class
   * field initializers have run, then calls the preparation lifecycle.
   */
  constructor(_data?: Record<string, unknown>, context?: { parent?: any }) {
    this.parent = context?.parent;
  }

  static defineSchema(): Record<string, DataField> {
    return {};
  }

  static migrateData(source: Record<string, unknown>): Record<string, unknown> {
    return source;
  }

  prepareBaseData?(): void;
  prepareDerivedData?(): void;
}

/**
 * Factory helper that creates a TypeDataModel instance and runs the full
 * Foundry data preparation lifecycle.
 *
 * Steps:
 * 1. Instantiate (class field initializers run, setting fields to undefined)
 * 2. Build schema defaults and deep-merge with provided data
 * 3. Run migrateData on the merged source
 * 4. Assign all fields to the instance (overwrites the undefined class fields)
 * 5. Call prepareBaseData() then prepareDerivedData()
 *
 * Use this in tests instead of `new Model(data)` to get a fully-initialized
 * model with derived fields populated.
 */
function createModel<T extends TypeDataModel>(
  ModelClass: new (data?: Record<string, unknown>, context?: { parent?: any }) => T,
  data?: Record<string, unknown>,
  context?: { parent?: any },
): T {
  const instance = new ModelClass(data, context);

  // Build initial data from schema, then deep-merge provided data on top
  const schema = (ModelClass as any).defineSchema();
  const initial = SchemaField.prototype.getInitialValue.call({ fields: schema });
  const source = deepMerge(initial, data ?? {});

  // Apply migrateData
  const migrated = (ModelClass as any).migrateData({ ...source });

  // Assign all fields to the instance (overwrites class field undefined values)
  for (const [key, value] of Object.entries(migrated)) {
    (instance as any)[key] = value;
  }

  // Run lifecycle
  if (typeof (instance as any).prepareBaseData === 'function') {
    (instance as any).prepareBaseData();
  }
  if (typeof (instance as any).prepareDerivedData === 'function') {
    (instance as any).prepareDerivedData();
  }
  return instance;
}

// =============================================================================
// Deep merge utility — merges source into target recursively for plain objects
// =============================================================================

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = result[key];
    if (
      srcVal !== null &&
      typeof srcVal === 'object' &&
      !Array.isArray(srcVal) &&
      tgtVal !== null &&
      typeof tgtVal === 'object' &&
      !Array.isArray(tgtVal)
    ) {
      result[key] = deepMerge(tgtVal as Record<string, unknown>, srcVal as Record<string, unknown>);
    } else {
      result[key] = srcVal;
    }
  }
  return result;
}

// =============================================================================
// Collection — minimal iterable container for items
// =============================================================================

class MockCollection<T> implements Iterable<T> {
  contents: T[];

  constructor(items: T[] = []) {
    this.contents = items;
  }

  get size(): number {
    return this.contents.length;
  }

  [Symbol.iterator](): Iterator<T> {
    return this.contents[Symbol.iterator]();
  }

  filter(fn: (item: T) => boolean): T[] {
    return this.contents.filter(fn);
  }

  map<U>(fn: (item: T) => U): U[] {
    return this.contents.map(fn);
  }

  find(fn: (item: T) => boolean): T | undefined {
    return this.contents.find(fn);
  }

  some(fn: (item: T) => boolean): boolean {
    return this.contents.some(fn);
  }

  push(item: T): void {
    this.contents.push(item);
  }
}

// =============================================================================
// Item — minimal mock
// =============================================================================

class MockItem {
  id: string;
  uuid: string;
  name: string;
  img: string;
  type: string;
  system: Record<string, unknown>;

  constructor(data: Partial<MockItem> = {}) {
    this.id = data.id ?? crypto.randomUUID();
    this.uuid = data.uuid ?? `Item.${this.id}`;
    this.name = data.name ?? '';
    this.img = data.img ?? '';
    this.type = data.type ?? 'equipment';
    this.system = data.system ?? {};
  }

  async update(data: Record<string, unknown>): Promise<this> {
    for (const [key, value] of Object.entries(data)) {
      const path = key.split('.');
      let target: any = this;
      for (let i = 0; i < path.length - 1; i++) {
        target = target[path[i]] ??= {};
      }
      target[path[path.length - 1]] = value;
    }
    return this;
  }

  async delete(): Promise<this> {
    return this;
  }
}

// =============================================================================
// Actor — mock with embedded document support and derived data delegation
// =============================================================================

class MockActor {
  id: string;
  uuid: string;
  name: string;
  img: string;
  type: string;
  system: Record<string, unknown>;
  items: MockCollection<MockItem>;

  /** Accumulated update calls for assertion. */
  _lastUpdate: Record<string, unknown> | null = null;

  constructor(data: Partial<MockActor> & { system?: Record<string, unknown> } = {}) {
    this.id = data.id ?? crypto.randomUUID();
    this.uuid = data.uuid ?? `Actor.${this.id}`;
    this.name = data.name ?? 'Test Actor';
    this.img = data.img ?? '';
    this.type = data.type ?? 'character';
    this.system = data.system ?? {};
    this.items = new MockCollection<MockItem>();
  }

  prepareDerivedData(): void {
    // Base no-op; subclasses override
  }

  _onCreateDescendantDocuments(
    _parent: any,
    _collection: string,
    _documents: MockItem[],
    _data: Record<string, unknown>[],
    _options: Record<string, unknown>,
    _userId: string,
  ): void {
    // Base no-op; subclasses override
  }

  async update(data: Record<string, unknown>): Promise<this> {
    this._lastUpdate = data;
    // Apply dot-path updates to system
    for (const [key, value] of Object.entries(data)) {
      const path = key.split('.');
      let target: any = this;
      for (let i = 0; i < path.length - 1; i++) {
        target = target[path[i]] ??= {};
      }
      target[path[path.length - 1]] = value;
    }
    return this;
  }

  async createEmbeddedDocuments(
    type: string,
    dataArray: Record<string, unknown>[],
  ): Promise<MockItem[]> {
    const created: MockItem[] = [];
    for (const d of dataArray) {
      const item = new MockItem(d as any);
      this.items.push(item);
      created.push(item);
    }
    // Trigger lifecycle hook
    this._onCreateDescendantDocuments(
      this,
      type === 'Item' ? 'items' : type,
      created,
      dataArray,
      {},
      'test-user',
    );
    return created;
  }
}

// =============================================================================
// Globals — game, CONFIG, Hooks, etc.
// =============================================================================

const mockGame = {
  system: { id: 'open00' },
  i18n: { localize: (key: string) => key },
  user: { name: 'Test GM', isGM: true },
  actors: new MockCollection<MockActor>(),
};

const mockConfig = {
  Actor: {
    documentClass: MockActor as any,
    dataModels: {} as Record<string, any>,
    trackableAttributes: {} as Record<string, any>,
  },
  Item: {
    documentClass: MockItem as any,
    dataModels: {} as Record<string, any>,
  },
};

const mockHooks = {
  once: (_event: string, _cb: (...args: any[]) => void) => {},
  on: (_event: string, _cb: (...args: any[]) => void) => {},
};

// =============================================================================
// Install on globalThis — MUST run before any model import
// =============================================================================

(globalThis as any).foundry = {
  abstract: {
    TypeDataModel,
  },
  data: {
    fields: {
      DataField,
      NumberField,
      StringField,
      BooleanField,
      ArrayField,
      SchemaField,
      HTMLField,
    },
  },
};

(globalThis as any).Actor = MockActor;
(globalThis as any).Item = MockItem;
(globalThis as any).Collection = MockCollection;
(globalThis as any).game = mockGame;
(globalThis as any).CONFIG = mockConfig;
(globalThis as any).Hooks = mockHooks;
(globalThis as any).fromUuid = async (_uuid: string) => null;

// =============================================================================
// Exports for direct use in tests (e.g. creating test actors/items)
// =============================================================================

export {
  MockActor,
  MockItem,
  MockCollection,
  TypeDataModel,
  createModel,
  DataField,
  NumberField,
  StringField,
  BooleanField,
  ArrayField,
  SchemaField,
  HTMLField,
};
