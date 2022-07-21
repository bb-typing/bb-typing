import type { ActionConfigNames, ActionConfigOption, ActionHotkey } from './types';

export function defineActionConfig<Scope extends string, C extends ActionConfigOption>(
  scope: Scope,
  config: ReadonlyArray<C>
) {
  return { scope, config } as const;
}

export function defineActionHotkeys<H extends ActionHotkey>(hotkeys: ReadonlyArray<H>) {
  return hotkeys;
}

type ActionParams = unknown;

export function defineActionNameParamsMap<T extends Record<ActionConfigNames, ActionParams>>(map: T) {
  return map;
}

export function defineType<T>(): T {
  // @ts-expect-error
  return '' as unknown;
}
