import { Platform } from '@ui/utils/platform';
import { useMount, useUnmount } from 'ahooks';
import type { JSXElementConstructor, ReactNode } from 'react';
import { useRef } from 'react';
import { useMemo } from 'react';
import type { CallbackOptions } from 'super-hotkey';
import superHotkey from 'super-hotkey';
import type { F } from 'ts-toolbelt';
import { I } from 'ts-toolbelt';

import { useHotkeyStore } from './store';
import type { BaseHotkeyMap, HotkeyContent, HotkeyInfo, HotkeyPlatform } from './types';
import { filterHotkeyMapByPlatform, filterPlatformHotkeyMapByScope } from './utils';
import type { ActionConfigName, ActionConfigScope } from '../action';
import { useActionStore } from '../action';
import { actionController } from '../action';

interface WithHotkeyOptions {
  /**
   * @default 'wrapper'
   */
  scopeElementType?: 'root' | 'wrapper';
}

export function withScopeHotkey<P extends JSX.IntrinsicAttributes>(
  scope: ActionConfigScope,
  Component: JSXElementConstructor<P>,
  options?: WithHotkeyOptions
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
      <HotKeyWrapper configs={hotkeyConfigs} {...options} scope={scope}>
        <Component {...props} />
      </HotKeyWrapper>
    );
  };
}

export function destroyHotkey(actionName: string, hotkeyContent: HotkeyContent) {
  superHotkey.unbindCallback(hotkeyContent, {
    id: actionName
  });
}

type HotkeyWrapperConfigs = Array<{ hotkeys: HotkeyContent[]; handler: F.Function }>;

function HotKeyWrapper(
  props: {
    children: ReactNode;
    configs: HotkeyWrapperConfigs;
    scope: ActionConfigScope;
  } & WithHotkeyOptions
): JSX.Element {
  const { scopeElementType = 'wrapper', children, configs, scope } = props;
  const wrapperElementRef = useRef<HTMLDivElement>(null);
  const getTargetElement = () => {
    return scopeElementType === 'root' ? document : wrapperElementRef.current!;
  };

  useMount(function bindHotkey() {
    configs.forEach(config => {
      superHotkey.bindCallback(config.hotkeys, {
        callback: config.handler,
        trigger: {
          allowRepeatWhenLongPress: false,
          capture: false
        },
        targetElement: getTargetElement()
      });
    });
  });

  useMount(function addActiveScope() {
    useActionStore.getState().addActiveScope(scope);
  });

  useUnmount(function unbindHotkey() {
    configs.forEach(config => {
      superHotkey.unbindCallback(config.hotkeys, {
        callback: config.handler,
        targetElement: getTargetElement()
      });
    });
  });

  useUnmount(function delActiveScope() {
    useActionStore.getState().delActiveScope(scope);
  });

  return scopeElementType === 'wrapper' ? (
    <div tabIndex={1} ref={wrapperElementRef}>
      {children}
    </div>
  ) : (
    <> {children}</>
  );
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
      hotkeyInfos.forEach(hotkeyInfo => {
        if (isUsableHotkey(hotkeyInfo)) {
          configsResult.push({
            handler: getHotkeyHandler(actionName as ActionConfigName),
            hotkeys: hotkeyInfos.map(item => item.hotkeyContent)
          });
        }
      });
    });
  });

  return configsResult;

  function getHotkeyHandler(actionName: ActionConfigName): CallbackOptions['callback'] {
    // TODO: 此处的 hotkey-callback 暂先这样，如有需要再设计
    return event => {
      (actionController as any).emit(actionName);
    };
  }

  function isUsableHotkey(hotkeyInfo: HotkeyInfo): boolean {
    const isSupportCurrentPlatform = hotkeyInfo.supportedPlatforms.includes(Platform.OS);
    const isEnableStatus = hotkeyInfo.status === 'enable';

    return isSupportCurrentPlatform && isEnableStatus;
  }
}
