import type { HotkeyInfo, HotkeyStoreState } from './types';
import { actionController } from '../action';

export function defaultHotkeysInitializer(): HotkeyStoreState['defaultHotkeyMap'] {
  const actionConfigModules = actionController.getActions();

  const defaultHotkeys: HotkeyStoreState['defaultHotkeyMap'] = {};

  actionConfigModules.forEach(module => {
    const { configs, scope } = module;

    configs.forEach(config => {
      const actionName = config.name;

      config.defaultHotkeys.forEach(hotkeyMap => {
        Object.entries(hotkeyMap).forEach(([platform, hotkeyContent]) => {
          defaultHotkeys[actionName] = {
            ...defaultHotkeys[actionName],
            [platform]: [
              {
                hotkeyContent,
                scope,
                status: 'enable'
              } as HotkeyInfo
            ]
          };
        });
      });
    });
  });

  return defaultHotkeys;
}
