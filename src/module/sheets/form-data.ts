export function flattenFormData(
  data: Record<string, unknown>,
  prefix = '',
  updates: Record<string, unknown> = {},
): Record<string, unknown> {
  for (const [key, value] of Object.entries(data)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const prototype = value !== null && typeof value === 'object'
      ? Object.getPrototypeOf(value)
      : undefined;

    if (prototype === Object.prototype || prototype === null) {
      flattenFormData(value as Record<string, unknown>, path, updates);
    } else {
      updates[path] = value;
    }
  }

  return updates;
}

interface SubmittedValue {
  found: boolean;
  value?: unknown;
}

function getSubmittedValue(data: Record<string, unknown>, path: string): SubmittedValue {
  if (Object.hasOwn(data, path)) {
    return { found: true, value: data[path] };
  }

  let current: unknown = data;
  for (const segment of path.split('.')) {
    if (current === null || typeof current !== 'object' || !Object.hasOwn(current, segment)) {
      return { found: false };
    }
    current = (current as Record<string, unknown>)[segment];
  }

  return { found: true, value: current };
}

/**
 * Convert ApplicationV2 form data into a safe document update payload.
 *
 * When the originating event carries a named control (change events from
 * submitOnChange AND submit events triggered by pressing Enter inside a
 * named input), only that single field is persisted.  This guards against
 * stale-form overwrites regardless of how the submit was triggered.
 *
 * The full-form flatten path is reserved for genuine submit events that
 * have no identifiable source field (e.g. a dedicated save button).
 */
export function getFormUpdates(
  event: SubmitEvent | Event,
  data: Record<string, unknown>,
): Record<string, unknown> {
  // Try to identify the single field that originated this event.
  // On 'change' events event.target IS the input; on 'submit' events
  // triggered by Enter, the submitter (if any) carries the field name.
  const target = event.type === 'submit'
    ? (event as SubmitEvent).submitter ?? event.target
    : event.target;
  const fieldName = (target as { name?: unknown } | null)?.name;

  if (typeof fieldName === 'string' && fieldName.length > 0) {
    // Resolve against the unflattened source so array entries and grouped
    // checkbox/multi-select values retain their submitted shape.
    const submitted = getSubmittedValue(data, fieldName);
    return submitted.found ? { [fieldName]: submitted.value } : {};
  }

  // No identifiable source field — fall back to persisting the full form.
  // This only triggers from an explicit submit button without a name.
  return flattenFormData(data);
}
