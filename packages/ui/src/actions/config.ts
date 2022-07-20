import type { PlatformName } from '@shared/types/base';
import {} from 'react-hotkeys';

export interface ActionConfigOption {
  name: `${PlatformName}:${string}` | (string & {});
  commands: readonly [enCommand: string, zhCommand: string];
  // hotkeys: string[];
  description: string;
}

export type ActionConfigNames = typeof actionConfigs[number]['name'];

function defineActionConfig<S extends ActionConfigOption>(configs: ReadonlyArray<S>) {
  return configs;
}

export const actionConfigs = defineActionConfig([
  {
    name: 'sidebar-switch',
    commands: ['Switch sidebar mode', '切换侧边栏模式'],
    description: '切换侧边栏模式'
  },
  {
    name: 'desktop:close-app',
    commands: ['Restart app', '重启应用'],
    description: '重启应用'
  }
] as const);
