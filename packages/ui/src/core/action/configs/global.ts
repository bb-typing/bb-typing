import { defineType, defineVariables } from '@shared/types/base';

import type { ActionConfigOption } from '../types';
import { defineActionConfig } from '../utils';

export const globalActionConfigs = defineActionConfig('global', [
  defineVariables<ActionConfigOption>()({
    name: 'system:desktop:close-app' as const,
    supportedPlatforms: ['desktop:mac', 'desktop:win'],
    commands: ['System: Restart app', '系统：重启应用'],
    defaultHotkeys: [
      {
        default: {
          id: '87440c6c-997f-5ccf-bae1-595fcc238e0a',
          modifierKey: ['Mod'],
          normalKey: 'r'
        }
      }
    ],
    __params_type__: defineType<unknown>()
  }),
  defineVariables<ActionConfigOption>()({
    name: 'system:open-search-modal' as const,
    supportedPlatforms: ['desktop:mac', 'desktop:win', 'web:mac', 'web:win'],
    commands: ['System: Open search modal', '系统：打开搜索框'],
    description: '打开搜索框，输入命令、描述等进行功能调用',
    defaultHotkeys: [
      {
        default: {
          id: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
          modifierKey: ['Mod'],
          normalKey: 'k'
        }
      },
      {
        default: {
          id: '03997f67-3ced-5d4b-ba8d-94cea77026c8',
          modifierKey: ['Mod', 'Shift'],
          normalKey: 'p'
        }
      }
    ],
    __params_type__: defineType<unknown>()
  }),
  defineVariables<ActionConfigOption>()({
    name: 'system:switch-theme-color' as const,
    supportedPlatforms: ['desktop:mac', 'desktop:win', 'web:mac', 'web:win'],
    commands: ['System: Switch Theme Color', '系统：切换主题色'],
    defaultHotkeys: [
      {
        default: {
          id: 'c908527f-2fe5-57b8-bbf0-c9e6db3fafa2',
          modifierKey: ['Mod'],
          normalKey: 'j'
        }
      }
    ],
    __params_type__: defineType<unknown>()
  }),
  defineVariables<ActionConfigOption>()({
    name: 'system:open-user-login' as const,
    supportedPlatforms: ['desktop:mac', 'desktop:win', 'web:mac', 'web:win'],
    commands: ['System: Open User Login Window', '系统：打开用户登录窗'],
    __params_type__: defineType<unknown>()
  }),
  defineVariables<ActionConfigOption>()({
    name: 'system:open-user-register' as const,
    supportedPlatforms: ['desktop:mac', 'desktop:win', 'web:mac', 'web:win'],
    commands: ['System: Open User Register Window', '系统：打开用户注册窗'],
    __params_type__: defineType<unknown>()
  }),
  defineVariables<ActionConfigOption>()({
    name: 'navigation:open-keyboard-shortcuts' as const,
    supportedPlatforms: ['desktop:mac', 'desktop:win', 'web:mac', 'web:win'],
    commands: ['Navigation: Open Keyboard Shortcuts', '导航：打开快捷键配置'],
    __params_type__: defineType<unknown>()
  })
]);
