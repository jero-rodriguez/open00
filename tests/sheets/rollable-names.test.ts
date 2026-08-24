import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const template = readFileSync('src/templates/actors/character-overview.hbs', 'utf8');

describe('character sheet roll affordances', () => {
  it('places stat roll actions on all six stat names', () => {
    expect(template.match(/class="roll-link roll-name stat-roll"/g)).toHaveLength(6);
  });

  it('places the save roll action on the save name', () => {
    expect(template).toContain('class="roll-link roll-name save-roll" data-action="rollSave"');
    expect(template).not.toContain('class="table-row save-row" data-action="rollSave"');
  });

  it('provides a d100 icon for every rollable name', () => {
    expect(template.match(/fa-dice-d100 roll-name-icon/g)).toHaveLength(7);
  });
});
