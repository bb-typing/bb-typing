import { describe, expect, it } from 'vitest';

import type { UserHotkeyMap } from '../types';
import { mergeHotkeyOfUserAndLocal } from '../utils';

describe('mergeHotkeyOfUserAndLocal - 合并用户自定义快捷键和本地快捷键', () => {
  it('两个截然不同的快捷键', () => {
    const testSource = {
      target: {
        'navigation:open-keyboard-shortcuts': {
          mac: [
            {
              hotkeyContent: {
                modifierKey: 'Ctrl',
                normalKey: 'Esc'
              },
              id: '743259f8-3c06-597d-9ffe-db0257df9d93',
              scope: 'global',
              supportedPlatforms: ['desktop:mac', 'web:mac'],
              updateTime: 1629200000000
            }
          ]
        }
      } as UserHotkeyMap,
      source: {
        'navigation:open-keyboard-shortcuts': {
          mac: [
            {
              hotkeyContent: {
                modifierKey: 'Ctrl',
                normalKey: 'k'
              },
              id: '141be907-50aa-5e6b-89d1-ce7da15b7513',
              scope: 'global',
              supportedPlatforms: ['desktop:mac', 'web:mac'],
              updateTime: 1629200000001
            }
          ]
        }
      } as UserHotkeyMap
    };

    expect(mergeHotkeyOfUserAndLocal(testSource.target, testSource.source)).deep.equals({
      'navigation:open-keyboard-shortcuts': {
        mac: [
          testSource.source['navigation:open-keyboard-shortcuts']!.mac![0],
          testSource.target['navigation:open-keyboard-shortcuts']!.mac![0]
        ]
      }
    });
  });

  it('两个相同的快捷键，但「更新时间」不同，会取最新的', () => {
    const testSource = {
      target: {
        'navigation:open-keyboard-shortcuts': {
          mac: [
            {
              hotkeyContent: {
                modifierKey: 'Ctrl',
                normalKey: 'Esc'
              },
              id: '743259f8-3c06-597d-9ffe-db0257df9d93',
              scope: 'global',
              supportedPlatforms: ['desktop:mac', 'web:mac'],
              updateTime: 1629200000000
            }
          ]
        }
      } as UserHotkeyMap,
      source: {
        'navigation:open-keyboard-shortcuts': {
          mac: [
            {
              hotkeyContent: {
                modifierKey: 'Ctrl',
                normalKey: 'Esc'
              },
              id: '141be907-50aa-5e6b-89d1-ce7da15b7513',
              scope: 'global',
              supportedPlatforms: ['desktop:mac', 'web:mac'],
              updateTime: 1629200000001
            }
          ]
        }
      } as UserHotkeyMap
    };

    expect(mergeHotkeyOfUserAndLocal(testSource.target, testSource.source)).deep.equals({
      'navigation:open-keyboard-shortcuts': {
        mac: [testSource.source['navigation:open-keyboard-shortcuts']!.mac![0]]
      }
    });
  });

  it('多平台的交集', () => {
    const testSource = {
      target: {
        'navigation:open-keyboard-shortcuts': {
          mac: [
            {
              hotkeyContent: {
                modifierKey: 'Ctrl',
                normalKey: 'Esc'
              },
              id: 'e009f09a-dd55-5614-ba4e-20cd057bc74f',
              scope: 'global',
              supportedPlatforms: ['desktop:mac', 'web:mac'],
              updateTime: 1629200000000
            }
          ],
          win: [
            {
              hotkeyContent: {
                modifierKey: 'Ctrl',
                normalKey: 'Esc'
              },
              id: '743259f8-3c06-597d-9ffe-db0257df9d93',
              scope: 'global',
              supportedPlatforms: ['web:win', 'desktop:win'],
              updateTime: 1629200000000
            }
          ]
        }
      } as UserHotkeyMap,
      source: {
        'navigation:open-keyboard-shortcuts': {
          mac: [
            {
              hotkeyContent: {
                modifierKey: 'Ctrl',
                normalKey: 'k'
              },
              id: '141be907-50aa-5e6b-89d1-ce7da15b7513',
              scope: 'global',
              supportedPlatforms: ['desktop:mac', 'web:mac'],
              updateTime: 1629200000001
            }
          ],
          win: [
            {
              hotkeyContent: {
                modifierKey: 'Ctrl',
                normalKey: 'Esc'
              },
              id: '1f1e2698-3209-580e-a4e0-7798e3927c26',
              scope: 'global',
              supportedPlatforms: ['web:win', 'desktop:win'],
              updateTime: 1629200000001
            }
          ]
        }
      } as UserHotkeyMap
    };

    expect(mergeHotkeyOfUserAndLocal(testSource.target, testSource.source)).deep.equals({
      'navigation:open-keyboard-shortcuts': {
        mac: [
          testSource.source['navigation:open-keyboard-shortcuts']!.mac![0],
          testSource.target['navigation:open-keyboard-shortcuts']!.mac![0]
        ],
        win: [testSource.source['navigation:open-keyboard-shortcuts']!.win![0]]
      }
    });
  });
});
