/**
 * Minimal FoundryVTT type declarations for the Open 00 system.
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

// FoundryVTT ApplicationV2 and Sheet APIs
declare namespace foundry {
  namespace applications {
    namespace api {
      interface ApplicationPosition {
        width?: number;
        height?: number;
        top?: number;
        left?: number;
      }

      interface ApplicationWindowOptions {
        title?: string;
        resizable?: boolean;
        minimizable?: boolean;
      }

      interface ApplicationConfiguration {
        id?: string;
        classes?: string[];
        tag?: string;
        position?: ApplicationPosition;
        window?: ApplicationWindowOptions;
        actions?: Record<string, (this: ApplicationV2, event: Event, target: HTMLElement) => void>;
      }

      interface ApplicationRenderOptions {
        force?: boolean;
        parts?: string[];
        [key: string]: unknown;
      }

      interface ApplicationPartDefinition {
        template: string;
        id?: string;
        classes?: string[];
        scrollable?: string[];
        templates?: string[];
        container?: {
          classes?: string[];
          id?: string;
        };
      }

      class ApplicationV2 {
        static DEFAULT_OPTIONS: ApplicationConfiguration;
        static PARTS: Record<string, ApplicationPartDefinition>;
        tabGroups: Record<string, string>;
        position: ApplicationPosition;
        get element(): HTMLElement;
        _prepareContext(options: ApplicationRenderOptions): Promise<Record<string, unknown>>;
        _preparePartContext(partId: string, context: Record<string, unknown>): Promise<Record<string, unknown>>;
        _onRender(context: Record<string, unknown>, options: ApplicationRenderOptions): Promise<void>;
        render(
          options?: boolean | ApplicationRenderOptions,
          legacyOptions?: ApplicationRenderOptions,
        ): Promise<unknown>;
        close(options?: Record<string, unknown>): Promise<void>;
      }

      /** Mixin that adds Handlebars template rendering to ApplicationV2 */
      function HandlebarsApplicationMixin<T extends abstract new (...args: any[]) => ApplicationV2>(
        base: T
      ): T;
    }

    namespace sheets {
      class ActorSheetV2 extends foundry.applications.api.ApplicationV2 {
        static DEFAULT_OPTIONS: foundry.applications.api.ApplicationConfiguration;
        static PARTS: Record<string, foundry.applications.api.ApplicationPartDefinition>;
        get actor(): Actor;
        get document(): Actor;
        form: HTMLFormElement | null;
        _prepareContext(options: foundry.applications.api.ApplicationRenderOptions): Promise<Record<string, unknown>>;
        _onDropItem(event: DragEvent, data: Record<string, unknown>): Promise<Item[] | false>;
      }

      class ItemSheetV2 extends foundry.applications.api.ApplicationV2 {
        static DEFAULT_OPTIONS: foundry.applications.api.ApplicationConfiguration;
        static PARTS: Record<string, foundry.applications.api.ApplicationPartDefinition>;
        get item(): Item;
        get document(): Item;
        form: HTMLFormElement | null;
        _prepareContext(options: foundry.applications.api.ApplicationRenderOptions): Promise<Record<string, unknown>>;
      }
    }
  }
}

/** FoundryVTT Actor document */
declare class Actor {
  name: string;
  img: string;
  type: string;
  system: Record<string, unknown>;
  items: Collection<Item>;
  update(data: Record<string, unknown>): Promise<this>;
}

/** FoundryVTT Item document */
declare class Item {
  id: string;
  name: string;
  img: string;
  type: string;
  system: Record<string, unknown>;
  sheet?: {
    render(force?: boolean, options?: Record<string, unknown>): Promise<unknown> | unknown;
  };
  update(data: Record<string, unknown>): Promise<this>;
  delete(): Promise<this>;
}

/** FoundryVTT Collection */
declare class Collection<T> implements Iterable<T> {
  [Symbol.iterator](): Iterator<T>;
  get size(): number;
  filter(fn: (item: T) => boolean): T[];
  map<U>(fn: (item: T) => U): U[];
  find(fn: (item: T) => boolean): T | undefined;
  contents: T[];
}

/** FoundryVTT documents and collections */
declare namespace foundry {
  namespace documents {
    namespace collections {
      const Actors: {
        registerSheet(
          scope: string,
          sheetClass: typeof foundry.applications.sheets.ActorSheetV2,
          options?: { types?: string[]; makeDefault?: boolean; label?: string }
        ): void;
      };

      const Items: {
        registerSheet(
          scope: string,
          sheetClass: typeof foundry.applications.sheets.ItemSheetV2,
          options?: { types?: string[]; makeDefault?: boolean; label?: string }
        ): void;
      };
    }
  }
}

/** Actors global namespace for sheet registration (deprecated in v13, use foundry.documents.collections.Actors) */
declare const Actors: {
  registerSheet(
    scope: string,
    sheetClass: typeof foundry.applications.sheets.ActorSheetV2,
    options?: { types?: string[]; makeDefault?: boolean; label?: string }
  ): void;
};

/** Items global namespace for sheet registration */
declare const Items: {
  registerSheet(
    scope: string,
    sheetClass: typeof foundry.applications.sheets.ItemSheetV2,
    options?: { types?: string[]; makeDefault?: boolean; label?: string }
  ): void;
};

// FoundryVTT CONFIG global
declare const CONFIG: {
  Actor: {
    dataModels: Record<string, typeof foundry.abstract.TypeDataModel>;
    trackableAttributes: Record<string, { bar: string[]; value: string[] }>;
  };
  Item: {
    dataModels: Record<string, typeof foundry.abstract.TypeDataModel>;
  };
};

// FoundryVTT game global
declare const game: {
  system?: {
    id: string;
  };
  i18n: {
    localize(key: string): string;
  };
  user: {
    name?: string;
    isGM: boolean;
  };
  actors: Collection<Actor>;
};

/** Resolve a UUID to a Document */
declare function fromUuid(uuid: string): Promise<Actor | Item | null>;

// FoundryVTT Roll class
declare class Roll {
  constructor(formula: string);
  evaluate(): Promise<void>;
  toMessage(options: {
    speaker?: { alias?: string };
    content?: string;
  }): Promise<unknown>;
}

// FoundryVTT ChatMessage class
declare const ChatMessage: {
  getSpeaker(options?: { actor?: Actor; alias?: string }): { alias?: string };
  create(data: {
    speaker?: { alias?: string };
    content?: string;
    type?: number;
  }): Promise<unknown>;
};

// FoundryVTT TextEditor utility
declare const TextEditor: {
  enrichHTML(content: string, options?: { async?: boolean; relativeTo?: Actor | Item }): Promise<string>;
};

// FoundryVTT constants
declare const CONST: {
  CHAT_MESSAGE_TYPES: {
    ROLL: number;
  };
};
