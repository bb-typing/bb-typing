import { expect, it } from 'vitest';

import { sortModifierKeys } from '../keyboard-shortcut';

it('sortModifierKeys - 修饰键的排序', () => {
  expect(sortModifierKeys(['Ctrl', 'Alt', 'Shift', 'Meta'])).toMatchObject([
    'Meta',
    'Ctrl',
    'Alt',
    'Shift'
  ]);

  expect(sortModifierKeys(['Shift', 'Alt', 'Ctrl', 'Meta'])).toMatchObject([
    'Meta',
    'Ctrl',
    'Alt',
    'Shift'
  ]);
});
