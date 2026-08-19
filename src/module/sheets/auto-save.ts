/**
 * Auto-save utility for form field changes in ApplicationV2 sheets.
 *
 * Provides debounced persistence with error handling and value revert on failure.
 * Supports blur and Enter key triggers with 500ms debounce delay.
 *
 * Requirements: 8.10, 8.12
 */

/** Configuration for auto-save behavior */
export interface AutoSaveConfig {
  debounceMs?: number;
  onError?: (error: Error, fieldName: string) => void;
}

/** Manages auto-save state for a single field */
interface FieldState {
  debounceTimer?: ReturnType<typeof setTimeout>;
  lastSavedValue: unknown;
  currentElement?: AutoSaveElement;
}

type AutoSaveElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

/** Preserve the persisted field type when values arrive from HTML controls. */
function coerceFormValue(currentValue: unknown, newValue: string): unknown {
  if (typeof currentValue === 'number') {
    const numericValue = Number(newValue);
    return Number.isFinite(numericValue) ? numericValue : currentValue;
  }

  if (typeof currentValue === 'boolean') return newValue === 'true';

  return newValue;
}

/** Clone persisted form data without retaining references to the Actor source. */
function cloneFormData(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(cloneFormData);

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, cloneFormData(entry)]),
    );
  }

  return value;
}

/** Assign a value below an already-cloned array field. */
function setNestedValue(root: unknown, parts: string[], value: unknown): void {
  let target = root as Record<string, unknown> | unknown[];

  for (const [index, part] of parts.entries()) {
    if (index === parts.length - 1) {
      (target as Record<string, unknown>)[part] = value;
      return;
    }

    target = (target as Record<string, unknown>)[part] as Record<string, unknown> | unknown[];
  }
}

/** Read a value below an object or array using path segments. */
function getNestedValue(root: unknown, parts: string[]): unknown {
  let value = root;
  for (const part of parts) {
    if (value === null || value === undefined) return undefined;
    value = (value as Record<string, unknown>)[part];
  }
  return value;
}

/**
 * Creates an auto-save handler for a sheet application.
 * 
 * Handles:
 * - Debounced persistence (500ms default)
 * - Automatic revert on save failure
 * - Error notifications via ui.notifications
 * - Blur and Enter key triggers
 *
 * @param actor - The Actor document to update
 * @param config - Configuration options
 * @returns Object containing field state management and the event handler
 */
export function createAutoSaveHandler(
  actor: Actor,
  config: AutoSaveConfig = {}
) {
  const debounceMs = config.debounceMs ?? 500;
  const fieldStates = new Map<string, FieldState>();

  /**
   * Get the current value from the actor at a dot-path
   */
  function getActorValue(fieldPath: string): unknown {
    const parts = fieldPath.split('.');
    let value: unknown = actor;
    for (const part of parts) {
      if (value === null || value === undefined) return undefined;
      value = (value as Record<string, unknown>)[part];
    }
    return value;
  }

  /**
   * Build a safe document update for a form field.
   *
   * Foundry ArrayFields do not support partial updates. If a form path enters an
   * array (for example system.skills.3.rank), replace the complete array with a
   * cloned copy containing the edited value instead of updating the indexed
   * leaf directly.
   */
  function buildDocumentUpdate(fieldName: string, newValue: string): Record<string, unknown> {
    const parts = fieldName.split('.');
    let value: unknown = actor;

    for (const [index, part] of parts.entries()) {
      if (value === null || value === undefined) break;
      value = (value as Record<string, unknown>)[part];

      if (Array.isArray(value) && index < parts.length - 1) {
        const arrayPath = parts.slice(0, index + 1).join('.');
        const replacement = cloneFormData(value);
        const nestedParts = parts.slice(index + 1);
        const currentValue = getNestedValue(value, nestedParts);
        setNestedValue(replacement, nestedParts, coerceFormValue(currentValue, newValue));
        return { [arrayPath]: replacement };
      }
    }

    return { [fieldName]: coerceFormValue(getActorValue(fieldName), newValue) };
  }

  /**
   * Persist a field change to the actor document
   */
  async function persistField(fieldName: string, newValue: string): Promise<void> {
    try {
      // Store the current (old) value before attempting update
      const fieldState = fieldStates.get(fieldName) || {
        lastSavedValue: getActorValue(fieldName),
      };
      fieldStates.set(fieldName, fieldState);

      // Perform the update
      await actor.update(buildDocumentUpdate(fieldName, newValue));

      // Update the saved value on success
      fieldState.lastSavedValue = newValue;
    } catch (error) {
      // On failure, revert the displayed value and notify user
      const element = fieldStates.get(fieldName)?.currentElement;
      if (element) {
        // Revert to last saved value (Requirement 8.12)
        const savedValue = fieldStates.get(fieldName)?.lastSavedValue ?? getActorValue(fieldName);
        element.value = String(savedValue ?? '');
      }

      // Show error notification
      const uiNotifications = (window as any).ui?.notifications;
      if (uiNotifications) {
        uiNotifications.error(
          `Failed to save field changes. Your edits have been reverted.`,
          { permanent: false }
        );
      }

      // Call custom error handler if provided
      if (config.onError) {
        config.onError(error as Error, fieldName);
      }

      console.error(`Auto-save failed for field ${fieldName}:`, error);
      throw error;
    }
  }

  /**
   * Debounced persistence handler
   */
  function debouncedPersist(fieldName: string, newValue: string, element: AutoSaveElement) {
    const fieldState = fieldStates.get(fieldName) || { lastSavedValue: getActorValue(fieldName) };
    fieldStates.set(fieldName, fieldState);

    // Store the element for potential revert
    fieldState.currentElement = element;

    // Clear any existing debounce timer
    if (fieldState.debounceTimer) {
      clearTimeout(fieldState.debounceTimer);
    }

    // Set a new debounce timer (Requirement 8.10 - 500ms)
    fieldState.debounceTimer = setTimeout(() => {
      fieldState.debounceTimer = undefined;
      persistField(fieldName, newValue).catch(() => {
        // Error already handled in persistField
      });
    }, debounceMs);
  }

  /**
   * Event handler for form field changes
   * 
   * Triggers on:
   * - blur event (field loses focus)
   * - Enter key press on input/textarea
   */
  function handleFieldChange(event: Event): void {
    const target = event.target as HTMLElement;

    if (!(
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLInputElement ||
      target instanceof HTMLSelectElement
    )) {
      return;
    }

    // Only process on blur or Enter key
    if (event.type === 'blur') {
      const fieldName = target.name;
      if (fieldName && target.value !== String(getActorValue(fieldName))) {
        debouncedPersist(fieldName, target.value, target);
      }
    } else if (event instanceof KeyboardEvent && event.key === 'Enter') {
      // Don't trigger auto-save on Enter for textareas (allow Shift+Enter for multiline)
      if (target instanceof HTMLTextAreaElement && !event.shiftKey) {
        return;
      }

      const fieldName = target.name;
      if (fieldName && target.value !== String(getActorValue(fieldName))) {
        debouncedPersist(fieldName, target.value, target);
        event.preventDefault();
      }
    }
  }

  /**
   * Clean up all pending debounce timers (call on sheet close)
   */
  function cleanup(): void {
    for (const [, state] of fieldStates) {
      if (state.debounceTimer) {
        clearTimeout(state.debounceTimer);
        state.debounceTimer = undefined;
      }
    }
    fieldStates.clear();
  }

  return {
    handleFieldChange,
    cleanup,
    persistField,
  };
}

/**
 * Attaches auto-save handlers to all input and textarea elements in a form
 * 
 * @param form - The form element
 * @param handler - The auto-save handler returned from createAutoSaveHandler
 */
export function attachAutoSaveToForm(
  form: HTMLFormElement,
  handler: ReturnType<typeof createAutoSaveHandler>
): () => void {
  const inputs = form.querySelectorAll<AutoSaveElement>(
    'input[name], textarea[name], select[name]'
  );

  const keydownListeners = new Map<AutoSaveElement, EventListener>();

  for (const input of inputs) {
    input.addEventListener('blur', handler.handleFieldChange);
    const keydownListener = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key === 'Enter') {
        handler.handleFieldChange(event);
      }
    };
    keydownListeners.set(input, keydownListener);
    input.addEventListener('keydown', keydownListener);
  }

  return () => {
    for (const input of inputs) {
      input.removeEventListener('blur', handler.handleFieldChange);
      const keydownListener = keydownListeners.get(input);
      if (keydownListener) input.removeEventListener('keydown', keydownListener);
    }
  };
}
