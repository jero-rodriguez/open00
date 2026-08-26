/**
 * Open00Item — Custom Item document class for the Open 00 system.
 *
 * Provides system-specific hooks for item lifecycle events.
 * When an identity item (Kin, Culture, Vocation) is added to an Actor,
 * seeding logic runs on the owning Actor (handled in Open00Actor / Slice 4).
 */
export class Open00Item extends Item {}
