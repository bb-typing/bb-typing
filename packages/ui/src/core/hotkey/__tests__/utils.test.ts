import { it } from 'vitest';

import { mergeHotkeyOfUserAndLocal } from '../utils';

it('mergeHotkeyOfUserAndLocal - 合并用户自定义快捷键和本地快捷键', () => {
  mergeHotkeyOfUserAndLocal({}, {});
});
