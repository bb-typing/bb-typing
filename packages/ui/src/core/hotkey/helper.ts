import type {
  BaseHotkeyMap,
  HotkeyInfo,
  HotkeyPlatform,
  HotkeyStoreState
} from './types';
import type { ActionConfigName, ActionConfigScope } from '../action';
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
                status: 'enable',
                supportedPlatforms: config.supportedPlatforms
              } as HotkeyInfo
            ]
          };
        });
      });
    });
  });

  return defaultHotkeys;
}

//#region  //*=========== filter ===========
// type ActionNameHotkeyMap = Record<ActionConfigName | AnyString, HotkeyInfo[]>;

type PlatformHotkeyMap = Record<ActionConfigName | AnyString, HotkeyInfo[]>;

type ScopePlatformHotkeyMap = Record<ActionConfigName | AnyString, HotkeyInfo[]>;

/** 根据「平台」过滤出「热键对象」 */
export function filterHotkeyMapByPlatform(
  hotkeyMap: BaseHotkeyMap,
  targetPlatform: Exclude<HotkeyPlatform, 'default'> | undefined,
  includeDefaultPlatform = true
): PlatformHotkeyMap {
  const filteredResult: PlatformHotkeyMap = {} as any;

  Object.entries(hotkeyMap).forEach(([actionName, platformHotInfoMap]) => {
    if (platformHotInfoMap) {
      Object.entries(platformHotInfoMap).forEach(([_platform, hotkeyInfos]) => {
        const platform = _platform as HotkeyPlatform;

        if (
          platform === targetPlatform ||
          (includeDefaultPlatform && platform === 'default')
        ) {
          filteredResult[actionName] = hotkeyInfos;
        }
      });
    }
  });

  return filteredResult;
}

/** 根据过滤好的「平台热键对象」再次过滤出「范围平台热键对象」 */
export function filterPlatformHotkeyMapByScope(
  platformHotkeyMap: PlatformHotkeyMap,
  scope: ActionConfigScope
): ScopePlatformHotkeyMap {
  const filteredResult: ScopePlatformHotkeyMap = {} as any;

  Object.entries(platformHotkeyMap).forEach(([actionName, hotkeyInfos]) => {
    filteredResult[actionName] = hotkeyInfos.filter(hotkey => hotkey.scope === scope);
  });

  return filteredResult;
}

//#endregion  //*======== filter ===========
