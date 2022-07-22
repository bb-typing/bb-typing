import type { ActionConfigOption } from './types';

export function defineActionConfig<Scope extends string, C extends ActionConfigOption>(
  scope: Scope,
  configs: ReadonlyArray<C>
) {
  return { scope, configs } as const;
}

export function defineType<T>(): T {
  // @ts-expect-error
  return '' as unknown;
}
