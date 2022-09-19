import { defineType, defineVariables } from '@shared/types/base';

import type { ActionConfigOption } from '../types';
import { defineActionConfig } from '../utils';

export const layoutActionConfigs = defineActionConfig('layout', [
  defineVariables<ActionConfigOption>()({
    name: 'sidebar-switch' as const,
    supportedPlatforms: ['web:mac', 'web:win', 'desktop:mac', 'desktop:win'],
    commands: ['Switch sidebar mode', '切换侧边栏模式'],
    description: '切换侧边栏模式',
    defaultHotkeys: [
      {
        default: {
          modifierKey: ['Mod'],
          normalKey: 'b'
        }
      }
    ],
    __params_type__: defineType<{ name: string }>()
  })
]);
