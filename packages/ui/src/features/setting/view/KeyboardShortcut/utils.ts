import type { ActionConfigName } from '@ui/core/action';
import type { ActionConfigOption } from '@ui/core/action';
import { actionController } from '@ui/core/action';
import type {
  BaseHotkeyInfo,
  HotkeyContent,
  HotkeyPlatform,
  UserHotkeyInfo,
  UserHotkeyMap
} from '@ui/core/hotkey';
import { filterHotkeyMapByPlatform, filterHotkeyPlatform } from '@ui/core/hotkey';
import { Platform } from '@ui/utils/platform';
import type { O } from 'ts-toolbelt';

export type ShortcutRenderSourceItem = (
  | ({
      type: 'user';
    } & UserHotkeyInfo)
  | ({
      type: 'default';
    } & O.Optional<BaseHotkeyInfo, 'id' | 'hotkeyContent'>)
) & {
  actionConfig: ActionConfigOption;
};

type ShortcutRenderSource = Record<
  ActionConfigName | AnyString,
  Array<ShortcutRenderSourceItem>
>;

export function convertToRenderSource(
  userHotkeyMap: UserHotkeyMap
): ShortcutRenderSource {
  const source: ShortcutRenderSource = {} as any;

  const currentHotkeyPlatform = filterHotkeyPlatform();

  const currentPlatformUserHotkeyMap = filterHotkeyMapByPlatform<1>(
    userHotkeyMap,
    currentHotkeyPlatform
  );

  const actionConfigModules = actionController.getActions();

  actionConfigModules.forEach(module => {
    module.configs.forEach(actionConfig => {
      const actionName = actionConfig.name;

      const isSupportedPlatform = actionConfig.supportedPlatforms.includes(
        Platform.OS as any
      );

      if (!isSupportedPlatform) return;

      const userHotkeyInfos = currentPlatformUserHotkeyMap[actionName];

      if ('defaultHotkeys' in actionConfig && actionConfig.defaultHotkeys.length !== 0) {
        const addedUserHotkeyIds = new Set<string>();

        actionConfig.defaultHotkeys.forEach(defaultHotkeyInfo => {
          Object.entries(defaultHotkeyInfo).forEach(
            ([hotkeyPlatform, platformHotkeyInfo]: [
              HotkeyPlatform | AnyString,
              HotkeyContent & { id: string }
            ]) => {
              const notSupportedHotkeyPlatform =
                hotkeyPlatform !== 'default' && currentHotkeyPlatform !== hotkeyPlatform;

              if (notSupportedHotkeyPlatform) return;

              const userHotkeyInfoOfEqualDefault = userHotkeyInfos?.find(
                userHotkeyInfo => userHotkeyInfo.defaultOriginId === platformHotkeyInfo.id
              );
              const existsInUserHotkey = !!userHotkeyInfoOfEqualDefault;

              if (existsInUserHotkey) {
                source[actionName] = [
                  ...(source[actionName] || []),
                  { type: 'user', actionConfig, ...userHotkeyInfoOfEqualDefault }
                ];

                addedUserHotkeyIds.add(userHotkeyInfoOfEqualDefault.id);
              } else {
                source[actionName] = [
                  ...(source[actionName] || []),
                  {
                    type: 'default',
                    actionConfig,
                    id: platformHotkeyInfo.id,
                    hotkeyContent: platformHotkeyInfo,
                    scope: module.scope,
                    supportedPlatforms: actionConfig.supportedPlatforms
                  }
                ];
              }
            }
          );
        });

        userHotkeyInfos?.forEach(userHotkeyInfo => {
          if (addedUserHotkeyIds.has(userHotkeyInfo.id)) return;

          source[actionName] = [
            ...(source[actionName] || []),
            { type: 'user', actionConfig, ...userHotkeyInfo }
          ];
        });
      } else {
        const notExistsInUserHotkey = !userHotkeyInfos?.length;

        if (notExistsInUserHotkey) {
          source[actionName] = [
            ...(source[actionName] ?? []),
            {
              type: 'default',
              actionConfig,
              scope: module.scope,
              supportedPlatforms: actionConfig.supportedPlatforms
            }
          ];
        } else {
          userHotkeyInfos.forEach(userHotkeyInfo => {
            source[actionName] = [
              ...(source[actionName] ?? []),
              { type: 'user', actionConfig, ...userHotkeyInfo }
            ];
          });
        }
      }

      // [null, null, 1] 整理成 [1]。或是 [null, null] 整理成 [null]。即：全部都是null时，保留一个null。或是null与其他值时，保留其他值。
      if (source[actionName]?.length > 1) {
        const allHotkeyContentIsNull = source[actionName].every(
          item => item.hotkeyContent === null
        );

        source[actionName] = allHotkeyContentIsNull
          ? [source[actionName][0]]
          : source[actionName].filter(item => !!item.hotkeyContent);
      }
    });
  });

  return source;
}
