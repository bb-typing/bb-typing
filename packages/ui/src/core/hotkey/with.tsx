import { Platform } from '@ui/utils/platform';
import type { JSXElementConstructor } from 'react';
import { useMemo } from 'react';
import type { HotKeysProps } from 'react-hotkeys';
import { HotKeys } from 'react-hotkeys';

import { filterHotkeyMapByPlatform, filterPlatformHotkeyMapByScope } from './helper';
import { useHotkeyStore } from './store';
import type { BaseHotkeyMap, HotkeyPlatform } from './types';
import type { ActionConfigName, ActionConfigScope } from '../action';
import { actionController } from '../action';

export function withScopeHotkey<P>(
  scope: ActionConfigScope,
  Component: JSXElementConstructor<P>
): JSXElementConstructor<P> {
  return function (props) {
    const { defaultHotkeyMap, localHotkeyMap, userHotkeyMap } = useHotkeyStore();

    const { handlers, keyMap } = useMemo(() => {
      return converToHotkeyPropsByHotkeyMaps(
        [defaultHotkeyMap, localHotkeyMap, userHotkeyMap],
        {
          hotkeyPlatform: filterHotkeyPlatform(),
          scope
        }
      );

      function filterHotkeyPlatform(): Exclude<HotkeyPlatform, 'default'> | undefined {
        switch (Platform.OS) {
          case 'web:win':
          case 'desktop:win':
            return 'win';

          case 'web:mac':
          case 'desktop:mac':
            return 'mac';
        }
      }
    }, [defaultHotkeyMap, localHotkeyMap, userHotkeyMap]);

    console.log('handlers, keyMap', handlers, keyMap);

    return (
      <HotKeys handlers={handlers} keyMap={keyMap}>
        <Component {...props} />
      </HotKeys>
    );
  };
}

function converToHotkeyPropsByHotkeyMaps(
  hotkeyMaps: BaseHotkeyMap[],
  options: {
    hotkeyPlatform: Exclude<HotkeyPlatform, 'default'> | undefined;
    scope: ActionConfigScope;
  }
): Pick<HotKeysProps, 'handlers' | 'keyMap'> {
  const handlers: HotKeysProps['handlers'] = {};
  const keyMap: HotKeysProps['keyMap'] = {};

  hotkeyMaps.forEach(hotkeyMap => {
    const scopePlatformHotkeyMap = filterPlatformHotkeyMapByScope(
      filterHotkeyMapByPlatform(hotkeyMap, options.hotkeyPlatform),
      options.scope
    );

    Object.entries(scopePlatformHotkeyMap).forEach(([actionName, hotkeyInfos]) => {
      hotkeyInfos.forEach(keyInfo => {
        const isSupportCurrentPlatform = keyInfo.supportedPlatforms.includes(Platform.OS);

        if (isSupportCurrentPlatform && keyInfo.status === 'enable') {
          if (!Reflect.has(keyMap, actionName)) {
            keyMap[actionName] = [];
          }

          handlers[actionName] = getHotkeyHandler(actionName as ActionConfigName);

          (keyMap[actionName] as string[]).push(keyInfo.hotkeyContent);
        }
      });
    });
  });

  return {
    handlers,
    keyMap
  };

  function getHotkeyHandler(actionName: ActionConfigName) {
    return (event?: KeyboardEvent) => {
      event?.preventDefault();
      console.log(`通过快捷键触发动作了，动作名称为「${actionName}」`);

      actionController.emit(actionName);
    };
  }
}
