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
    // 6 stat rows + 1 save row template = at least 7 dice icon buttons
    // Stats have a separate icon-button with fa-dice-d100 at end of row
    // Save rolls also have a separate icon-button with fa-dice-d100
    const diceIcons = template.match(/class="icon-button roll-skill" data-action="roll(Stat|Save)"/g);
    expect(diceIcons!.length).toBeGreaterThanOrEqual(7);
  });
});
