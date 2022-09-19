import type { ActionConfigOption } from './types';

export function defineActionConfig<Scope extends string, C extends ActionConfigOption>(
  scope: Scope,
  configs: Array<C>
) {
  return { scope, configs };
}
