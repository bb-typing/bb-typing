import { Platform } from '@ui/utils/platform';
import { useMount, useUnmount } from 'ahooks';
import Mousetrap from 'mousetrap';
import type { JSXElementConstructor, ReactNode } from 'react';
import { useMemo } from 'react';
import type { F } from 'ts-toolbelt';

import { filterHotkeyMapByPlatform, filterPlatformHotkeyMapByScope } from './helper';
import { useHotkeyStore } from './store';
import type { BaseHotkeyMap, HotkeyInfo, HotkeyPlatform } from './types';
import type { ActionConfigName, ActionConfigScope } from '../action';
import { actionController } from '../action';

export function withScopeHotkey<P>(
  scope: ActionConfigScope,
  Component: JSXElementConstructor<P>
): JSXElementConstructor<P> {
  return function (props) {
    const { defaultHotkeyMap, localHotkeyMap, userHotkeyMap } = useHotkeyStore();

    const hotkeyConfigs = useMemo(() => {
      return converToHotkeyConfigs([defaultHotkeyMap, localHotkeyMap, userHotkeyMap], {
        hotkeyPlatform: filterHotkeyPlatform(),
        scope
      });

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

    return (
      <HotKeyWrapper configs={hotkeyConfigs}>
        <Component {...props} />
      </HotKeyWrapper>
    );
  };
}

type HotkeyWrapperConfigs = Array<{ hotkeys: string[]; handler: F.Function }>;

function HotKeyWrapper(props: {
  children: ReactNode;
  configs: HotkeyWrapperConfigs;
}): JSX.Element {
  useMount(bindHotkey);

  useUnmount(unbindHotkey);

  return <>{props.children}</>;

  function bindHotkey() {
    props.configs.forEach(config => {
      Mousetrap.bind(config.hotkeys, config.handler);
    });
  }

  function unbindHotkey() {
    props.configs.forEach(config => {
      Mousetrap.unbind(config.hotkeys);
    });
  }
}

function converToHotkeyConfigs(
  hotkeyMaps: BaseHotkeyMap[],
  options: {
    hotkeyPlatform: Exclude<HotkeyPlatform, 'default'> | undefined;
    scope: ActionConfigScope;
  }
): HotkeyWrapperConfigs {
  const configsResult: HotkeyWrapperConfigs = [];

  hotkeyMaps.forEach(hotkeyMap => {
    const scopePlatformHotkeyMap = filterPlatformHotkeyMapByScope(
      filterHotkeyMapByPlatform(hotkeyMap, options.hotkeyPlatform),
      options.scope
    );

    Object.entries(scopePlatformHotkeyMap).forEach(([actionName, hotkeyInfos]) => {
      hotkeyInfos.forEach(keyInfo => {
        if (isUsableHotkey(keyInfo)) {
          configsResult.push({
            handler: getHotkeyHandler(actionName as ActionConfigName),
            hotkeys: hotkeyInfos.map(item => item.hotkeyContent)
          });
        }
      });
    });
  });

  return configsResult;

  type MousetrapBindCallback = Parameters<Mousetrap.MousetrapStatic['bind']>[1];
  function getHotkeyHandler(actionName: ActionConfigName): MousetrapBindCallback {
    // TODO: 此处的 hotkey-callback 暂先这样，如有需要再设计
    return event => {
      actionController.emit(actionName);

      return false;
    };
  }

  function isUsableHotkey(hotkeyInfo: HotkeyInfo): boolean {
    const isSupportCurrentPlatform = hotkeyInfo.supportedPlatforms.includes(Platform.OS);
    const isEnableStatus = hotkeyInfo.status === 'enable';

    return isSupportCurrentPlatform && isEnableStatus;
  }
}
