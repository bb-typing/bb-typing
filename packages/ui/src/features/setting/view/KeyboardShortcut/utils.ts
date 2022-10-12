import type { ActionConfigName } from '@ui/core/action';
import { actionController } from '@ui/core/action';
import type { ActionConfigOption } from '@ui/core/action/types';
import type {
  BaseHotkeyInfo,
  BaseHotkeyMap,
  HotkeyContent,
  HotkeyPlatform,
  UserHotkeyInfo,
  UserHotkeyMap
} from '@ui/core/hotkey/types';
import { filterHotkeyMapByPlatform, filterHotkeyPlatform } from '@ui/core/hotkey/utils';
import { Platform } from '@ui/utils/platform';
import { pick } from 'lodash';
import type { O } from 'ts-toolbelt';

export type ShortcutRenderSourceItem = (
  | ({
      type: 'user';
    } & O.Omit<UserHotkeyInfo, 'scope' | 'name' | 'supportedPlatforms'>)
  | ({
      type: 'default';
    } & O.Omit<
      O.Optional<BaseHotkeyInfo, 'id' | 'hotkeyContent'>,
      'scope' | 'name' | 'supportedPlatforms'
    >)
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
        actionConfig.defaultHotkeys.forEach(defaultHotkeyInfo => {
          Object.entries(defaultHotkeyInfo).forEach(
            ([hotkeyPlatform, platformHotkeyInfo]: [
              HotkeyPlatform | AnyString,
              HotkeyContent & { id: string }
            ]) => {
              const notSupportedHotkeyPlatform =
                hotkeyPlatform !== 'default' && currentHotkeyPlatform !== hotkeyPlatform;

              if (notSupportedHotkeyPlatform) return;

              let existsInUserHotkey = false;

              userHotkeyInfos?.forEach(userHotkeyInfo => {
                if (userHotkeyInfo.defaultOriginId === platformHotkeyInfo.id) {
                  existsInUserHotkey = true;
                  source[actionName] = [
                    ...(source[actionName] || []),
                    { type: 'user', actionConfig, ...userHotkeyInfo }
                  ];
                }
              });

              if (!existsInUserHotkey) {
                source[actionName] = [
                  ...(source[actionName] || []),
                  {
                    type: 'default',
                    actionConfig,
                    id: platformHotkeyInfo.id,
                    hotkeyContent: platformHotkeyInfo
                  }
                ];
              }
            }
          );
        });
      } else {
        const notExistsInUserHotkey = !userHotkeyInfos;

        if (notExistsInUserHotkey) {
          source[actionName] = [
            ...(source[actionName] ?? []),
            { type: 'default', actionConfig }
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
    });
  });

  // Object.entries(currentPlatformDefaultHotkeyMap).forEach(
  //   ([actionName, defaultHotkeyInfos]) => {
  //     const actionConfig = actionController.getActionByName(actionName)!;

  //     defaultHotkeyInfos.forEach(defaultHotkeyInfo => {
  //       const notExistsInUserHotkey = !currentPlatformUserHotkeyMap[actionName]?.some(
  //         userHotkey => userHotkey.defaultOriginId === defaultHotkeyInfo.id
  //       );
  //       const isSupportedPlatform = defaultHotkeyInfo.supportedPlatforms.includes(
  //         Platform.OS as any
  //       );

  //       if (notExistsInUserHotkey && isSupportedPlatform) {
  //         source[actionName] = [
  //           ...(source[actionName] ?? []),
  //           {
  //             type: 'default',
  //             actionConfig,
  //             ...defaultHotkeyInfo
  //           }
  //         ];
  //       }
  //     });
  //   }
  // );

  // Object.entries(currentPlatformUserHotkeyMap).forEach(
  //   ([actionName, userHotkeyInfos]) => {
  //     const actionConfig = actionController.getActionByName(actionName)!;

  //     userHotkeyInfos.forEach(userHotkeyInfo => {
  //       const isSupportedPlatform = userHotkeyInfo.supportedPlatforms.includes(
  //         Platform.OS as any
  //       );

  //       if (isSupportedPlatform) {
  //         source[actionName] = [
  //           ...(source[actionName] ?? []),
  //           {
  //             type: 'user',
  //             actionConfig,
  //             ...userHotkeyInfo
  //           }
  //         ];
  //       }
  //     });
  //   }
  // );

  return source;
}
