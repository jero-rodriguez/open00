/**
 * Minimal type declarations for Foundry VTT v14 globals.
 *
 * These declarations provide just enough typing to compile the system
 * source code without the full Foundry type definitions.
 * In production, the Foundry runtime provides these globals.
 */

interface TrackableAttributeConfig {
  bar: string[];
  value?: string[];
}

interface ActorConfig {
  dataModels: Record<string, unknown>;
  trackableAttributes: Record<string, TrackableAttributeConfig>;
}

interface ItemConfig {
  dataModels: Record<string, unknown>;
}

interface CombatConfig {
  documentClass: unknown;
}

interface CombatantConfig {
  documentClass: unknown;
}

interface FoundryConfig {
  Actor: ActorConfig;
  Item: ItemConfig;
  Combat: CombatConfig;
  Combatant: CombatantConfig;
}

declare const CONFIG: FoundryConfig;

interface HooksStatic {
  once(hook: string, callback: (...args: unknown[]) => void): void;
  on(hook: string, callback: (...args: unknown[]) => void): void;
}

declare const Hooks: HooksStatic;

declare function loadTemplates(paths: string[]): Promise<void>;
