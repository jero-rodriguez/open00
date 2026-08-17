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
