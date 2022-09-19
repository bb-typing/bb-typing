import { Platform } from '@ui/utils/platform';

import { actionController } from './controller';
import type { ActionConfigName, ActionConfigOption, ActionStoreState } from './types';

export function defineActionConfig<Scope extends string, C extends ActionConfigOption>(
  scope: Scope,
  configs: Array<C>
) {
  return { scope, configs };
}

export function filterUsableActionsByActiveScope(
  activeScopes: ActionStoreState['activeScopes'],
  options: {
    ignoreActionNames: ActionConfigName[];
  }
): ActionConfigOption[] {
  const actionConfigModules = actionController.getActions();
  const usableActions: ActionConfigOption[] = [];

  actionConfigModules.forEach(module => {
    const isActiveScope = activeScopes.includes(module.scope);

    module.configs.forEach(config => {
      const isSupportedPlatform = config.supportedPlatforms.includes(Platform.OS as any);
      const isIgnoredAction = options.ignoreActionNames.includes(config.name);

      if (isActiveScope && isSupportedPlatform && !isIgnoredAction) {
        usableActions.push(config);
      }
    });
  });

  return usableActions;
}
