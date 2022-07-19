import type { ActionConfigOption } from './types';

function defineActionConfig<S extends ActionConfigOption>(configs: ReadonlyArray<S>) {
  return configs;
}

export const actionConfigs = defineActionConfig([
  {
    name: 'sidebar-switch',
    commands: ['Switch sidebar mode', '切换侧边栏模式'],
    description: '切换侧边栏模式'
  }
] as const);
