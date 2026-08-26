/**
 * System-specific augmentations for Open00.
 *
 * fvtt-types (14.366.0-beta.20260825144710) provides all core FoundryVTT type
 * declarations. This file contains ONLY:
 *   1. Thin system-specific CONFIG type augmentations (permanent)
 *   2. Temporary bridge declarations so the existing (pre-v2) codebase compiles
 *      against the real types. Each bridge is marked TODO(v2-slice-N) naming
 *      the slice that removes it.
 *
 * IMPORTANT: These bridges are DELIBERATE and TEMPORARY. They exist because the
 * existing models/sheets were written against hand-rolled permissive stubs and
 * need the schema reshape (slice 2), sheet migration (slice 3), and document
 * subclasses (slice 2) before they can use fvtt-types natively.
 */

export {};

// =============================================================================
// BRIDGE: TypeDataModel without generics
// TODO(v2-slice-2): Remove once all DataModels provide proper type arguments.
//
// fvtt-types declares TypeDataModel<Schema, Parent, BaseData?, DerivedData?>.
// Our existing models extend `foundry.abstract.TypeDataModel` without args.
// This re-declaration allows unparameterized extension by providing defaults.
// =============================================================================
declare global {
  namespace foundry {
    namespace abstract {
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      class TypeDataModel {
        static defineSchema(): Record<string, foundry.data.fields.DataField>;
        prepareBaseData?(): void;
        prepareDerivedData?(): void;
        parent?: any;
      }
    }

    // =========================================================================
    // BRIDGE: DataField compatibility
    // TODO(v2-slice-2): Remove once models use proper fvtt-types field generics.
    //
    // fvtt-types' DataField has strict generic options. Our models return
    // `Record<string, DataField>` from defineSchema, where DataField is the
    // base class. This lets any field be assignable to it.
    // =========================================================================
    namespace data {
      namespace fields {
        type DataFieldOptions = Record<string, unknown>;

        class DataField {
          constructor(options?: DataFieldOptions);
          options: DataFieldOptions;
        }

        class NumberField extends DataField {
          constructor(options?: Record<string, unknown>);
        }

        class StringField extends DataField {
          constructor(options?: Record<string, unknown>);
        }

        class BooleanField extends DataField {
          constructor(options?: Record<string, unknown>);
        }

        class ArrayField extends DataField {
          constructor(element: DataField, options?: Record<string, unknown>);
        }

        class SchemaField extends DataField {
          constructor(fields: Record<string, DataField>, options?: Record<string, unknown>);
        }

        class HTMLField extends DataField {
          constructor(options?: Record<string, unknown>);
        }
      }
    }

    // =========================================================================
    // BRIDGE: ApplicationV2 namespace type aliases
    // TODO(v2-slice-3): Remove once sheets use fvtt-types native type paths.
    //
    // Our sheets reference foundry.applications.api.ApplicationConfiguration,
    // ApplicationRenderOptions, and ApplicationPartDefinition. In fvtt-types
    // these are nested on ApplicationV2 (e.g. ApplicationV2.Configuration).
    // This bridge re-exports them at the old namespace path.
    // =========================================================================
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
          form?: { handler?: Function; submitOnChange?: boolean };
          actions?: Record<string, (event: Event, target: HTMLElement) => void>;
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
          get window(): { content: HTMLElement };
          submit(): Promise<void>;
          _prepareContext(options: ApplicationRenderOptions): Promise<Record<string, unknown>>;
          _preparePartContext(partId: string, context: Record<string, unknown>): Promise<Record<string, unknown>>;
          _onRender(context: Record<string, unknown>, options: ApplicationRenderOptions): Promise<void>;
          render(
            options?: boolean | ApplicationRenderOptions,
            legacyOptions?: ApplicationRenderOptions,
          ): Promise<unknown>;
          close(options?: Record<string, unknown>): Promise<void>;
        }

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

      namespace ux {
        const TextEditor: {
          implementation: {
            enrichHTML(content: string, options?: Record<string, unknown>): Promise<string>;
          };
        };
      }
    }
  }

  // ===========================================================================
  // BRIDGE: Actor and Item document interfaces
  // TODO(v2-slice-2): Remove once Open00Actor/Open00Item provide typed .system.
  //
  // fvtt-types provides Actor and Item as complex generic classes. Our code
  // accesses .system, .items, .type, .name, .img, .id, .uuid, .update(),
  // .delete() directly. This bridge ensures those properties exist with
  // permissive types until document subclasses are introduced.
  // ===========================================================================
  class Actor {
    uuid: string;
    name: string;
    img: string;
    type: string;
    system: Record<string, unknown>;
    items: Collection<Item>;
    update(data: Record<string, unknown>): Promise<this>;
    prepareDerivedData(): void;
  }

  class Item {
    id: string;
    uuid: string;
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

  class Collection<T> implements Iterable<T> {
    [Symbol.iterator](): Iterator<T>;
    get size(): number;
    filter(fn: (item: T) => boolean): T[];
    map<U>(fn: (item: T) => U): U[];
    find(fn: (item: T) => boolean): T | undefined;
    contents: T[];
  }

  // ===========================================================================
  // BRIDGE: Sheet registration + CONFIG + globals
  // TODO(v2-slice-2): Remove CONFIG bridge once typed dataModels are registered.
  // TODO(v2-slice-3): Remove sheet registration bridge once sheets extend
  //                   fvtt-types' native sheet classes.
  // ===========================================================================
  namespace foundry {
    namespace documents {
      namespace collections {
        const Actors: {
          registerSheet(
            scope: string,
            sheetClass: any,
            options?: { types?: string[]; makeDefault?: boolean; label?: string }
          ): void;
        };

        const Items: {
          registerSheet(
            scope: string,
            sheetClass: any,
            options?: { types?: string[]; makeDefault?: boolean; label?: string }
          ): void;
        };
      }
    }
  }

  const Actors: {
    registerSheet(
      scope: string,
      sheetClass: any,
      options?: { types?: string[]; makeDefault?: boolean; label?: string }
    ): void;
  };

  const Items: {
    registerSheet(
      scope: string,
      sheetClass: any,
      options?: { types?: string[]; makeDefault?: boolean; label?: string }
    ): void;
  };

  const CONFIG: {
    Actor: {
      documentClass: typeof Actor;
      dataModels: Record<string, any>;
      trackableAttributes: Record<string, { bar: string[]; value: string[] }>;
    };
    Item: {
      documentClass: typeof Item;
      dataModels: Record<string, any>;
    };
  };

  const game: {
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

  const Hooks: {
    once(event: string, callback: (...args: any[]) => void): void;
    on(event: string, callback: (...args: any[]) => void): void;
  };

  function fromUuid(uuid: string): Promise<Actor | Item | null>;

  /**
   * BRIDGE: FormDataExtended
   * TODO(v2-slice-3): Remove once fvtt-types exposes the native FormDataExtended class.
   *
   * Foundry's FormDataExtended wraps a submitted form and exposes .object
   * with dot-path keys mapped to their typed values.
   */
  class FormDataExtended {
    constructor(form: HTMLFormElement, options?: Record<string, unknown>);
    readonly object: Record<string, unknown>;
  }

  class Roll {
    constructor(formula: string);
    evaluate(): Promise<void>;
    toMessage(options: {
      speaker?: { alias?: string };
      content?: string;
    }): Promise<unknown>;
  }

  const ChatMessage: {
    getSpeaker(options?: { actor?: Actor; alias?: string }): { alias?: string };
    create(data: {
      speaker?: { alias?: string };
      content?: string;
      type?: number;
    }): Promise<unknown>;
  };

  const CONST: {
    CHAT_MESSAGE_TYPES: {
      ROLL: number;
    };
  };
}
