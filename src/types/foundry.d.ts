/**
 * System-specific augmentations for Open00.
 *
 * fvtt-types (14.366.0-beta.20260825144710) provides all core FoundryVTT type
 * declarations. This file contains ONLY:
 *   1. Thin system-specific CONFIG type augmentations (permanent)
 *   2. Temporary data-model/document bridges for pre-v2 source which has not
 *      yet migrated to the strict generic document schemas.
 *
 * IMPORTANT: These bridges are DELIBERATE and TEMPORARY. They exist because the
 * existing models were written against hand-rolled permissive stubs and need
 * the schema reshape and document subclasses before they can use fvtt-types
 * natively. ApplicationV2 sheets use fvtt-types directly.
 */

export {};

declare module 'fvtt-types/configuration' {
  interface DataModelConfig {
    Actor: {
      character: typeof import('../module/models/actor/character.js').CharacterDataModel;
      npc: typeof import('../module/models/actor/npc.js').NpcDataModel;
    };
    Item: {
      weapon: typeof import('../module/models/item/weapon.js').WeaponDataModel;
      armor: typeof import('../module/models/item/armor.js').ArmorDataModel;
      spell: typeof import('../module/models/item/spell.js').SpellDataModel;
      spellLore: typeof import('../module/models/item/spell-lore.js').SpellLoreDataModel;
      equipment: typeof import('../module/models/item/equipment.js').EquipmentDataModel;
      kin: typeof import('../module/models/item/kin.js').KinDataModel;
      culture: typeof import('../module/models/item/culture.js').CultureDataModel;
      vocation: typeof import('../module/models/item/vocation.js').VocationDataModel;
      trait: typeof import('../module/models/item/kin-trait.js').KinTraitDataModel;
      itemOfPower: typeof import('../module/models/item/item-of-power.js').ItemOfPowerDataModel;
      background: typeof import('../module/models/item/background.js').BackgroundDataModel;
    };
  }
}

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
        static migrateData(source: Record<string, unknown>): Record<string, unknown>;
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
    createEmbeddedDocuments(type: string, data: Record<string, unknown>[]): Promise<Item[]>;
    prepareDerivedData(): void;
    _onCreateDescendantDocuments(
      parent: any,
      collection: string,
      documents: Item[],
      data: Record<string, unknown>[],
      options: Record<string, unknown>,
      userId: string,
    ): void;
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

}
