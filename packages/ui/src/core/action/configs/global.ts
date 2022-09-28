import { defineType, defineVariables } from '@shared/types/base';

import type { ActionConfigOption } from '../types';
import { defineActionConfig } from '../utils';

export const globalActionConfigs = defineActionConfig('global', [
  defineVariables<ActionConfigOption>()({
    name: 'system:desktop:close-app' as const,
    supportedPlatforms: ['desktop:mac', 'desktop:win'],
    commands: ['Restart app', '重启应用'],
    description: '重启应用',
    defaultHotkeys: [
      {
        default: {
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
          modifierKey: ['Mod'],
          normalKey: 'k'
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
          modifierKey: ['Mod'],
          normalKey: 'j'
        }
      }
    ],
    __params_type__: defineType<unknown>()
  }),
  defineVariables<ActionConfigOption>()({
    name: 'navigation:open-keyboard-shortcuts' as const,
    supportedPlatforms: ['desktop:mac', 'desktop:win', 'web:mac', 'web:win'],
    commands: ['Navigation: Open Keyboard Shortcuts', '导航：打开快捷键配置'],
    __params_type__: defineType<unknown>()
  })
]);
