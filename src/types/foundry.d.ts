/**
 * Minimal FoundryVTT type declarations for the VsD system.
 * These declare the global objects available at runtime within FoundryVTT.
 * Full type coverage will be added as modules are implemented.
 */

declare interface HooksCallbacks {
  init: () => void;
  ready: () => void;
}

declare const Hooks: {
  once<K extends keyof HooksCallbacks>(event: K, callback: HooksCallbacks[K]): void;
  on<K extends keyof HooksCallbacks>(event: K, callback: HooksCallbacks[K]): void;
};

// FoundryVTT v14 Data Fields
declare namespace foundry {
  namespace data {
    namespace fields {
      interface DataFieldOptions {
        required?: boolean;
        nullable?: boolean;
        initial?: unknown;
        label?: string;
        hint?: string;
      }

      interface NumberFieldOptions extends DataFieldOptions {
        initial?: number;
        min?: number;
        max?: number;
        step?: number;
        integer?: boolean;
        positive?: boolean;
        choices?: number[];
      }

      interface StringFieldOptions extends DataFieldOptions {
        initial?: string;
        blank?: boolean;
        trim?: boolean;
        max?: number;
        choices?: readonly string[] | Record<string, string>;
      }

      interface BooleanFieldOptions extends DataFieldOptions {
        initial?: boolean;
      }

      interface ArrayFieldOptions extends DataFieldOptions {
        initial?: unknown[];
        max?: number;
      }

      interface SchemaFieldOptions extends DataFieldOptions {}

      class DataField {
        constructor(options?: DataFieldOptions);
      }

      class NumberField extends DataField {
        constructor(options?: NumberFieldOptions);
      }

      class StringField extends DataField {
        constructor(options?: StringFieldOptions);
      }

      class BooleanField extends DataField {
        constructor(options?: BooleanFieldOptions);
      }

      class ArrayField extends DataField {
        constructor(element: DataField, options?: ArrayFieldOptions);
      }

      class SchemaField extends DataField {
        constructor(fields: Record<string, DataField>, options?: SchemaFieldOptions);
      }

      class HTMLField extends DataField {
        constructor(options?: DataFieldOptions);
      }
    }
  }

  namespace abstract {
    class TypeDataModel {
      static defineSchema(): Record<string, foundry.data.fields.DataField>;
      prepareDerivedData?(): void;
    }
  }
}
