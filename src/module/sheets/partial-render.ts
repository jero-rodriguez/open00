/** Parts of the character sheet affected by editable Actor fields. */
const PART_ORDER = ['header', 'overview', 'combat', 'magic', 'equipment', 'biography'] as const;

type SheetPart = (typeof PART_ORDER)[number];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/** Flatten both expanded and dot-notation update data into document paths. */
function collectUpdatePaths(data: Record<string, unknown>, prefix = ''): string[] {
  const paths: string[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (key === '_id') continue;
    const path = prefix ? `${prefix}.${key}` : key;

    if (isRecord(value) && Object.keys(value).length > 0) {
      paths.push(...collectUpdatePaths(value, path));
    } else {
      paths.push(path);
    }
  }

  return paths;
}

function partsForPath(path: string): SheetPart[] | null {
  if (path === 'name' || path === 'img' || path.startsWith('system.experience.')) {
    return ['header'];
  }

  if (
    path.startsWith('system.passions.')
    || path.startsWith('system.drivePoints.')
    || path === 'system.heroicPath'
  ) {
    return ['overview'];
  }

  if (path === 'system.stats.brn') return ['overview', 'magic', 'equipment'];
  if (path.startsWith('system.stats.')) return ['overview', 'magic'];
  if (path === 'system.skills' || path.startsWith('system.skills.')) return ['overview', 'magic'];

  if (
    path === 'system.defense'
    || path.startsWith('system.hp.')
    || path === 'system.encumbrance'
  ) {
    return ['combat'];
  }

  if (path.startsWith('system.mp.')) return ['magic'];
  if (path === 'system.wealth') return ['equipment'];

  if (
    path === 'system.biography'
    || path === 'system.appearance'
    || path === 'system.backgroundNotes'
  ) {
    return ['biography'];
  }

  return null;
}

/**
 * Resolve an Actor update to the smallest safe set of character-sheet parts.
 * Returns undefined when an unfamiliar field requires Foundry's full render.
 */
export function getCharacterSheetUpdateParts(
  renderData: unknown,
): string[] | undefined {
  if (!isRecord(renderData)) return undefined;

  const paths = collectUpdatePaths(renderData);
  if (paths.length === 0) return undefined;

  const affected = new Set<SheetPart>();
  for (const path of paths) {
    const parts = partsForPath(path);
    if (!parts) return undefined;
    parts.forEach((part) => affected.add(part));
  }

  return PART_ORDER.filter((part) => affected.has(part));
}
