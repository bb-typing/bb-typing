import { expect, it } from 'vitest';

import { modifierKeysReorder, normalKeysReorder } from '../keyboard-shortcut';

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

it('keyStrSorter - 按键字符串的排序', () => {
  expect(normalKeysReorder(['$', 'AltGraph'])).toMatchObject(['$', 'AltGraph']);

  expect(normalKeysReorder(['$', 'KeyR'])).toMatchObject(['$', 'KeyR']);

  expect(normalKeysReorder(['$', 'KeyR', 'KeyA'])).toMatchObject(['$', 'KeyA', 'KeyR']);

  expect(normalKeysReorder(['$', 'KeyR', 'KeyA', 'KeyB'])).toMatchObject([
    '$',
    'KeyA',
    'KeyB',
    'KeyR'
  ]);
});
