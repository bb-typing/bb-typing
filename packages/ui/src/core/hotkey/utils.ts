import { Platform } from '@ui/utils/platform';
import _ from 'lodash';

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

type ScopePlatformHotkeyMap<T> = Record<ActionConfigName | AnyString, Array<T>>;

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
  const filteredResult = {} as PlatformHotkeyMap<C>;

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
): ScopePlatformHotkeyMap<T> {
  const filteredResult = {} as ScopePlatformHotkeyMap<T>;

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

export function mergeHotkeyOfUserAndLocal(
  targetMap: UserHotkeyMap,
  sourceMap: UserHotkeyMap
) {
  return _.mergeWith(
    {},
    targetMap,
    sourceMap,
    (targetValue: UserHotkeyInfo[], sourceValue: UserHotkeyInfo[]) => {
      if (Array.isArray(sourceValue)) {
        // 如果 targetValue 不存在，则直接返回 sourceValue
        if (!targetValue) {
          return sourceValue;
        }

        const excludedOrAddedTargetIds: string[] = [];

        // 否则，遍历 sourceValue，判断 targetValue 中是否存在相同的 hotkey
        // 如果存在，则根据两者的 updateTime 来决定是否覆盖（取最新的）
        // 如果不存在，则直接添加
        return sourceValue
          .map(sourceItem => {
            const targetHotkeyOfSameHotkey = targetValue.find(targetItem =>
              // 只需判断 hotkeyContent，其余的都是一样的
              _.isEqual(targetItem.hotkeyContent, sourceItem.hotkeyContent)
            );

            if (!targetHotkeyOfSameHotkey) {
              return sourceItem;
            }

            excludedOrAddedTargetIds.push(targetHotkeyOfSameHotkey.id);

            if (sourceItem.updateTime > targetHotkeyOfSameHotkey.updateTime) {
              return sourceItem;
            } else {
              return targetHotkeyOfSameHotkey;
            }
          })
          .concat(
            targetValue.filter(item => !excludedOrAddedTargetIds.includes(item.id))
          );
      }
    }
  );
}
