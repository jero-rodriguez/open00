import { afterEach, describe, expect, it, vi } from 'vitest';
import { Open00ItemSheet } from '../../src/module/sheets/item-sheet.js';
import { MockItem } from '../foundry-shim.js';

function createItemSheet(type = 'weapon'): Open00ItemSheet & {
  document: MockItem;
  element: HTMLElement;
} {
  const sheet = new Open00ItemSheet() as Open00ItemSheet & {
    document: MockItem;
    element: HTMLElement;
  };
  const item = new MockItem({ type });
  sheet.document = item;
  Object.defineProperty(sheet, 'item', {
    configurable: true,
    value: item,
  });
  return sheet;
}

describe('Open00ItemSheet render lifecycle', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('preserves caller-provided parts unchanged', async () => {
    const sheet = createItemSheet();
    const basePrototype = Object.getPrototypeOf(Open00ItemSheet.prototype);
    const render = vi.spyOn(basePrototype, 'render').mockResolvedValue(sheet);

    await sheet.render({
      renderContext: 'updateItem',
      parts: ['qualities'],
    } as foundry.applications.sheets.ItemSheetV2.RenderOptions);

    expect(render).toHaveBeenCalledWith({
      renderContext: 'updateItem',
      parts: ['qualities'],
    });
  });

  it('renders all visible parts for a full render and scopes document updates', async () => {
    const sheet = createItemSheet('weapon');
    const basePrototype = Object.getPrototypeOf(Open00ItemSheet.prototype);
    const render = vi.spyOn(basePrototype, 'render').mockResolvedValue(sheet);

    await sheet.render({ force: true } as foundry.applications.sheets.ItemSheetV2.RenderOptions);
    expect(render).toHaveBeenLastCalledWith({
      force: true,
      parts: ['header', 'tabs', 'details', 'qualities', 'commerce', 'description'],
    });

    await sheet.render({
      renderContext: 'updateItem',
    } as foundry.applications.sheets.ItemSheetV2.RenderOptions);
    expect(render).toHaveBeenLastCalledWith({
      renderContext: 'updateItem',
      parts: ['header', 'details'],
    });
  });

  it('does not accumulate SpellLore drag listeners across rerenders', async () => {
    const sheet = createItemSheet('spellLore');
    const element = new EventTarget() as EventTarget & {
      querySelectorAll: () => HTMLElement[];
    };
    element.querySelectorAll = () => [];
    Object.defineProperty(sheet, 'element', {
      configurable: true,
      value: element,
    });

    await sheet._onRender({}, {} as foundry.applications.sheets.ItemSheetV2.RenderOptions);
    await sheet._onRender({}, {} as foundry.applications.sheets.ItemSheetV2.RenderOptions);

    const event = new Event('dragover', { cancelable: true });
    const preventDefault = vi.spyOn(event, 'preventDefault');
    element.dispatchEvent(event);

    expect(preventDefault).toHaveBeenCalledTimes(1);
  });
});
