import type { actionConfigs } from './config';
import type { PlatformName } from '../types/base';

export interface ActionConfigOption {
  name: `${PlatformName}:${string}` | (string & {});
  commands: readonly [enCommand: string, zhCommand: string];
  description: string;
}

export type ActionConfigNames = typeof actionConfigs[number]['name'];

type ActionParams = unknown;
function defineActionNameParamsMap<T extends Record<ActionConfigNames, ActionParams>>(map: T) {
  return map;
}

const actionNameParamsMap = defineActionNameParamsMap({
  'sidebar-switch': null
} as const);

export type ActionNameParamsMap = typeof actionNameParamsMap;
