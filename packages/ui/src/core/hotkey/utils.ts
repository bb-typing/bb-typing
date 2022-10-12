import { Platform } from '@ui/utils/platform';

import type {
  BaseHotkeyInfo,
  BaseHotkeyMap,
  HotkeyContent,
  HotkeyPlatform,
  HotkeyStoreState,
  UserHotkeyInfo,
  UserHotkeyMap
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

      if (!('defaultHotkeys' in config)) return;

      config.defaultHotkeys.forEach(hotkeyMap => {
        Object.entries(hotkeyMap).forEach(
          ([_platform, hotkeyContent]: [unknown, HotkeyContent & { id: string }]) => {
            const platform = _platform as HotkeyPlatform;

            defaultHotkeys[actionName] = {
              ...defaultHotkeys[actionName],
              [platform]: (
                (defaultHotkeys[actionName]?.[platform] ?? []) as BaseHotkeyInfo[]
              ).concat([
                {
                  id: hotkeyContent.id,
                  hotkeyContent,
                  scope,
                  supportedPlatforms: config.supportedPlatforms
                }
              ])
            };
          }
        );
      });
    });
  });

  return defaultHotkeys;
}

//#region  //*=========== filter ===========

type PlatformHotkeyMap<H extends BaseHotkeyInfo | UserHotkeyInfo> = Partial<
  Record<ActionConfigName | AnyString, Array<H>>
>;

type ScopePlatformHotkeyMap = Record<
  ActionConfigName | AnyString,
  Array<BaseHotkeyInfo | UserHotkeyInfo>
>;

/** 根据「平台」过滤出「热键对象」 */
export function filterHotkeyMapByPlatform<
  H extends number,
  C extends BaseHotkeyInfo | UserHotkeyInfo = H extends 1
    ? UserHotkeyInfo
    : BaseHotkeyInfo
>(
  hotkeyMap: BaseHotkeyMap | UserHotkeyMap,
  targetPlatform: Exclude<HotkeyPlatform, 'default'> | undefined,
  includeDefaultPlatform = true
): Partial<PlatformHotkeyMap<C>> {
  const filteredResult: PlatformHotkeyMap<C> = {} as any;

  Object.entries(hotkeyMap).forEach(([actionName, platformHotInfoMap]) => {
    if (platformHotInfoMap) {
      Object.entries(platformHotInfoMap).forEach(([_platform, hotkeyInfos]) => {
        const platform = _platform as HotkeyPlatform;

        if (
          platform === targetPlatform ||
          (includeDefaultPlatform && platform === 'default')
        ) {
          filteredResult[actionName] = hotkeyInfos as any;
        }
      });
    }
  });

  return filteredResult as any;
}

/** 根据过滤好的「平台热键对象」再次过滤出「范围平台热键对象」 */
export function filterPlatformHotkeyMapByScope<T extends BaseHotkeyInfo | UserHotkeyInfo>(
  platformHotkeyMap: PlatformHotkeyMap<T>,
  scope: ActionConfigScope
): ScopePlatformHotkeyMap {
  const filteredResult: ScopePlatformHotkeyMap = {} as any;

  Object.entries(platformHotkeyMap).forEach(([actionName, hotkeyInfos]) => {
    filteredResult[actionName] = hotkeyInfos!.filter(hotkey => hotkey.scope === scope);
  });

  return filteredResult;
}

export function filterHotkeyPlatform(): Exclude<HotkeyPlatform, 'default'> | undefined {
  switch (Platform.OS) {
    case 'web:win':
    case 'desktop:win':
      return 'win';

    case 'web:mac':
    case 'desktop:mac':
      return 'mac';
  }
}

//#endregion  //*======== filter ===========

export function isUserHotkeyInfo(
  hotkeyInfo: BaseHotkeyInfo | UserHotkeyInfo
): hotkeyInfo is UserHotkeyInfo {
  return 'updateTime' in hotkeyInfo;
}
