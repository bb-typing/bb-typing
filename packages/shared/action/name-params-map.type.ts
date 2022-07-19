import type { ActionConfigNames } from './config';

type ActionParams = unknown;
function defineActionNameParamsMap<T extends Record<ActionConfigNames, ActionParams>>(map: T) {
  return map;
}

function defineType<T>(): T {
  return '' as any;
}

export const actionNameParamsOfNull: unique symbol = Symbol();

export type ActionNameParamsMap = typeof actionNameParamsMap;

const actionNameParamsMap = defineActionNameParamsMap({
  'sidebar-switch': actionNameParamsOfNull,
  'desktop:close-app': defineType<{ name: string }>()
} as const);
