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
