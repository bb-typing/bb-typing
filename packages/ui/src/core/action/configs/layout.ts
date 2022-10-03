import { defineType, defineVariables } from '@shared/types/base';

import type { ActionConfigOption } from '../types';
import { defineActionConfig } from '../utils';

export const layoutActionConfigs = defineActionConfig('layout', [
  defineVariables<ActionConfigOption>()({
    name: 'layout:sidebar-switch' as const,
    supportedPlatforms: ['web:mac', 'web:win', 'desktop:mac', 'desktop:win'],
    commands: ['Layout: Switch sidebar mode', '布局：切换侧边栏模式'],
    description: '切换侧边栏模式',
    defaultHotkeys: [
      {
        default: {
          id: 'f83fc875-f307-5770-9e40-7e60d28ac2a8',
          modifierKey: ['Mod'],
          normalKey: 'b'
        }
      }
    ],
    __params_type__: defineType<{ name: string }>()
  })
]);
