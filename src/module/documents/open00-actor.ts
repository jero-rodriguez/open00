/**
 * Open00Actor — Custom Actor document class for the Open 00 system.
 *
 * Delegates derived-data computation to the TypeDataModel on `this.system`,
 * ensuring each actor sub-type (character, npc) owns its own derivation logic.
 */
export class Open00Actor extends Actor {
  override prepareDerivedData(): void {
    super.prepareDerivedData();

    // Delegate to the TypeDataModel's prepareDerivedData (if defined).
    // The DataModel lifecycle already calls it, but an explicit delegation
    // allows the document to orchestrate cross-item derivation (e.g., reading
    // owned Kin/Vocation items) before or after the model runs.
    if (
      this.system &&
      typeof (this.system as any).prepareDerivedData === 'function'
    ) {
      (this.system as any).prepareDerivedData();
    }
  }
}
