import { defineActionConfig, defineType } from '../helper';

export const layoutActionConfig = defineActionConfig('layout', [
  {
    name: 'sidebar-switch',
    commands: ['Switch sidebar mode', '切换侧边栏模式'],
    description: '切换侧边栏模式',
    defaultHotkeys: [
      {
        mac: 'command+b',
        win: 'ctrl+b'
      }
    ],
    __params_type__: defineType<{ name: string }>()
  }
] as const);
