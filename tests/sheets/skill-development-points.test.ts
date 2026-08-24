import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const sheetSource = readFileSync('src/module/sheets/character-sheet.ts', 'utf8');
const template = readFileSync('src/templates/actors/character-overview.hbs', 'utf8');

describe('character skill development points', () => {
  it('maps vocation development points onto each skill category', () => {
    expect(sheetSource).toContain("['developmentPoints'] as Record<string, unknown>");
    expect(sheetSource).toContain('developmentPoints: asNumber(vocationDevelopmentPoints?.[category.toLowerCase()])');
  });

  it('renders the category development points in a circle', () => {
    expect(template).toContain('class="development-points-circle"');
    expect(template).toContain('{{developmentPoints}}');
  });
});
