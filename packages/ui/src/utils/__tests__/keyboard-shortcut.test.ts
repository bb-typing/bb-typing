import { expect, it } from 'vitest';

import { modifierKeysReorder } from '../keyboard-shortcut';

it('sortModifierKeys - 修饰键的排序', () => {
  expect(modifierKeysReorder(['Ctrl', 'Alt', 'Shift', 'Meta'])).toMatchObject([
    'Meta',
    'Ctrl',
    'Alt',
    'Shift'
  ]);

  expect(modifierKeysReorder(['Shift', 'Alt', 'Ctrl', 'Meta'])).toMatchObject([
    'Meta',
    'Ctrl',
    'Alt',
    'Shift'
  ]);
});
