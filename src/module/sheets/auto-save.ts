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
  currentElement?: HTMLInputElement | HTMLTextAreaElement;
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
      value = (value as Record<string, unknown>)[part];
    }
    return value;
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
      await actor.update({ [fieldName]: newValue });

      // Update the saved value on success
      fieldState.lastSavedValue = newValue;
    } catch (error) {
      // On failure, revert the displayed value and notify user
      const element = fieldStates.get(fieldName)?.currentElement;
      if (element) {
        // Revert to last saved value (Requirement 8.12)
        const savedValue = fieldStates.get(fieldName)?.lastSavedValue ?? getActorValue(fieldName);
        (element as HTMLInputElement | HTMLTextAreaElement).value = String(savedValue ?? '');
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
  function debouncedPersist(fieldName: string, newValue: string, element: HTMLInputElement | HTMLTextAreaElement) {
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

    if (!(target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement)) {
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
): void {
  const inputs = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    'input[name], textarea[name]'
  );

  for (const input of inputs) {
    input.addEventListener('blur', handler.handleFieldChange);
    input.addEventListener('keydown', (event: Event) => {
      if (event instanceof KeyboardEvent && event.key === 'Enter') {
        handler.handleFieldChange(event);
      }
    });
  }
}
