import { Platform } from '@ui/utils/platform';
import { useMount, useUnmount } from 'ahooks';
import type { JSXElementConstructor, ReactNode } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import type { CallbackOptions } from 'super-hotkey';
import superHotkey from 'super-hotkey';
import type { F } from 'ts-toolbelt';

import { useHotkeyStore } from './store';
import type {
  BaseHotkeyInfo,
  BaseHotkeyMap,
  HotkeyContent,
  HotkeyPlatform,
  UserHotkeyInfo,
  UserHotkeyMap
} from './types';
import {
  filterHotkeyMapByPlatform,
  filterHotkeyPlatform,
  filterPlatformHotkeyMapByScope
} from './utils';
import type { ActionConfigName, ActionConfigScope } from '../action';
import { actionController, useActionStore } from '../action';

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
    const { defaultHotkeyMap, userHotkeyMap } = useHotkeyStore();

    const hotkeyConfigs = useMemo(() => {
      return converToHotkeyConfigs(
        {
          default: defaultHotkeyMap,
          user: userHotkeyMap
        },
        {
          hotkeyPlatform: filterHotkeyPlatform(),
          scope
        }
      );
    }, [defaultHotkeyMap, userHotkeyMap]);

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

  useEffect(() => {
    unbindHotkey();
    bindHotkey();

    return unbindHotkey;
  }, [configs]);

  useMount(function addActiveScope() {
    useActionStore.getState().addActiveScope(scope);
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

  function bindHotkey() {
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
  }

  function unbindHotkey() {
    configs.forEach(config => {
      superHotkey.unbindCallback(config.hotkeys, {
        callback: config.handler,
        targetElement: getTargetElement()
      });
    });
  }

  function getTargetElement() {
    return scopeElementType === 'root' ? document : wrapperElementRef.current!;
  }
}

function converToHotkeyConfigs(
  configOrigin: {
    user: UserHotkeyMap;
    default: BaseHotkeyMap;
  },
  options: {
    hotkeyPlatform: Exclude<HotkeyPlatform, 'default'> | undefined;
    scope: ActionConfigScope;
  }
): HotkeyWrapperConfigs {
  const configs: HotkeyWrapperConfigs = [];

  const currentScopeHotkey = {
    user: filterPlatformHotkeyMapByScope(
      filterHotkeyMapByPlatform<1>(configOrigin.user, options.hotkeyPlatform),
      options.scope
    ),
    default: filterPlatformHotkeyMapByScope(
      filterHotkeyMapByPlatform(configOrigin.default, options.hotkeyPlatform),
      options.scope
    )
  };

  [currentScopeHotkey.default, currentScopeHotkey.user].forEach((hotkeyMap, index) => {
    const isDefaultConfigOrigin = index === 0;

    Object.entries(hotkeyMap).forEach(
      ([actionName, hotkeyInfos]: [string, Array<UserHotkeyInfo | BaseHotkeyInfo>]) => {
        const usableHotkeyInfos = hotkeyInfos.filter(hotkeyInfo => {
          const isSupportCurrentPlatform = hotkeyInfo.supportedPlatforms.includes(
            Platform.OS
          );
          const hasHotkeyContent = !!hotkeyInfo.hotkeyContent;

          if (isSupportCurrentPlatform && hasHotkeyContent) {
            if (isDefaultConfigOrigin) {
              const existInUserHotkey = currentScopeHotkey.user[actionName]?.some(
                userHotkeyInfo => userHotkeyInfo.defaultOriginId === hotkeyInfo.id
              );

              if (existInUserHotkey) return false;
            }

            return true;
          }

          return false;
        });

        if (usableHotkeyInfos.length !== 0) {
          configs.push({
            handler() {
              // TODO: 此处的 hotkey-callback 暂先这样，如有需要再设计
              (actionController as any).emit(actionName);
            },
            hotkeys: usableHotkeyInfos.map(item => item.hotkeyContent!)
          });
        }
      }
    );
  });

  return configs;
}
