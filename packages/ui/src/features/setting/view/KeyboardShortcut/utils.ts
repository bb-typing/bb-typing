import type { ActionConfigName } from '@ui/core/action';
import { actionController } from '@ui/core/action';
import type { ActionConfigOption } from '@ui/core/action/types';
import type {
  BaseHotkeyInfo,
  BaseHotkeyMap,
  UserHotkeyInfo,
  UserHotkeyMap
} from '@ui/core/hotkey/types';
import { filterHotkeyMapByPlatform, filterHotkeyPlatform } from '@ui/core/hotkey/utils';
import { Platform } from '@ui/utils/platform';

export type ShortcutRenderSourceItem = (
  | ({
      type: 'user';
    } & UserHotkeyInfo)
  | ({
      type: 'default';
    } & BaseHotkeyInfo)
) & {
  actionConfig: ActionConfigOption;
};

type ShortcutRenderSource = Record<
  ActionConfigName | AnyString,
  Array<ShortcutRenderSourceItem>
>;

export function convertToRenderSource(
  defaultHotkeyMap: BaseHotkeyMap,
  userHotkeyMap: UserHotkeyMap
): ShortcutRenderSource {
  const source: ShortcutRenderSource = {} as any;

  const currentHotkeyPlatform = filterHotkeyPlatform();

  const currentPlatformDefaultHotkeyMap = filterHotkeyMapByPlatform(
    defaultHotkeyMap,
    currentHotkeyPlatform
  );

  const currentPlatformUserHotkeyMap = filterHotkeyMapByPlatform<1>(
    userHotkeyMap,
    currentHotkeyPlatform
  );

  Object.entries(currentPlatformDefaultHotkeyMap).forEach(
    ([actionName, defaultHotkeyInfos]) => {
      const actionConfig = actionController.getActionByName(actionName)!;

      defaultHotkeyInfos.forEach(defaultHotkeyInfo => {
        const notExistsInUserHotkey = !currentPlatformUserHotkeyMap[actionName]?.some(
          userHotkey => userHotkey.defaultOriginId === defaultHotkeyInfo.id
        );
        const isSupportedPlatform = defaultHotkeyInfo.supportedPlatforms.includes(
          Platform.OS as any
        );

        if (notExistsInUserHotkey && isSupportedPlatform) {
          source[actionName] = [
            ...(source[actionName] ?? []),
            {
              type: 'default',
              actionConfig,
              ...defaultHotkeyInfo
            }
          ];
        }
      });
    }
  );

  Object.entries(currentPlatformUserHotkeyMap).forEach(
    ([actionName, userHotkeyInfos]) => {
      const actionConfig = actionController.getActionByName(actionName)!;

      userHotkeyInfos.forEach(userHotkeyInfo => {
        const isSupportedPlatform = userHotkeyInfo.supportedPlatforms.includes(
          Platform.OS as any
        );

        if (isSupportedPlatform) {
          source[actionName] = [
            ...(source[actionName] ?? []),
            {
              type: 'user',
              actionConfig,
              ...userHotkeyInfo
            }
          ];
        }
      });
    }
  );

  return source;
}
