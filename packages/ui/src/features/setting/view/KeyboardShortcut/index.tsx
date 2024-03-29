import { Button, Divider, Kbd, Select, Table, Tooltip } from '@mantine/core';
import type { NotificationProps } from '@mantine/notifications';
import { showNotification } from '@mantine/notifications';
import { defineVariables } from '@shared/types/base';
import {
  useComputedHotkeyState,
  useHotkeyActions,
  useTrackedHotkeyState
} from '@ui/core/hotkey/';
import type { HotkeyContent } from '@ui/core/hotkey/types';
import { apiSaveUserSetting } from '@ui/features/user/api/apis';
import { useUserSaveSettingAPI } from '@ui/features/user/api/hooks/useSaveSetting';
import { useComputedUserState } from '@ui/features/user/store';
import useThemeStyle from '@ui/styles/useThemeStyle';
import { modifierKeyBeautify, normalKeyBeautify } from '@ui/utils/keyboard-shortcut';
import React, { memo, useMemo, useRef } from 'react';
import { tw } from 'twind';

import 'react-contexify/dist/ReactContexify.css';

import type { ContextMenuProps } from './ContextMenu';
import ContextMenu from './ContextMenu';
import { convertToRenderSource } from './utils';

interface ViewShortcutKeyProps {}

const ViewKeyboardShortcut: React.FC<ViewShortcutKeyProps> = props => {
  const { activeHotkeyType } = useTrackedHotkeyState();
  const { currentActiveHotkeyMap } = useComputedHotkeyState();

  const hotkeyActions = useHotkeyActions();
  const { userLoggedIn } = useComputedUserState();

  const activeHotkeyIsLocal = activeHotkeyType === 'local';

  const contextMenuRef = useRef() as ContextMenuProps['contextRef'];
  const t = useThemeStyle();

  const { isLoading: userSaveSettingLoading, mutateAsync: userSaveSetting } =
    useUserSaveSettingAPI();

  const renderSource = useMemo(
    () => convertToRenderSource(currentActiveHotkeyMap),
    [currentActiveHotkeyMap]
  );

  const rows = (() => {
    const result: React.ReactNode[] = [];

    Object.entries(renderSource).map(([actionName, shortcuts]) => {
      shortcuts.forEach(shortcut => {
        const isUserDefined = shortcut.type === 'user';
        const hasHotkeyContent = !!shortcut.hotkeyContent;

        result.push(
          <tr
            key={shortcut.id || actionName}
            onContextMenu={event => {
              contextMenuRef.current?.open(event, shortcut);
            }}
            className={tw(
              `focus:(bg-[${t.selector(t.mt.colors.dark[5], t.mt.colors.gray[1])}])`,
              `hover:(bg-[${t.selector(t.mt.colors.dark[6], t.mt.colors.gray[0])}])`
            )}
            tabIndex={0}
          >
            <td>{shortcut.actionConfig.commands[1]}</td>
            <td>{hasHotkeyContent ? renderShortcuts(shortcut.hotkeyContent!) : '-'}</td>

            <td>{isUserDefined ? '用户' : '默认'}</td>
          </tr>
        );
      });
    });

    return result;

    function renderShortcuts(hotkeyContent: HotkeyContent) {
      if (!hotkeyContent) return;
      const { modifierKey, normalKey } = hotkeyContent;

      const modifierKeyJSX: React.ReactNode = (() => {
        if (!modifierKey) return null;

        if (Array.isArray(modifierKey)) {
          if (modifierKey.length === 0) {
            return null;
          }

          return modifierKey.map(key => (
            <Kbd key={key} className={tw`mr-[4px]`}>
              {modifierKeyBeautify(key)}
            </Kbd>
          ));
        }

        return <Kbd className={tw`mr-[4px]`}>{modifierKeyBeautify(modifierKey)}</Kbd>;
      })();

      const normalKeyJSX: React.ReactNode = (() => {
        if (!normalKey) return null;

        if (Array.isArray(normalKey)) {
          if (normalKey.length === 0) {
            return null;
          }

          return normalKey.map(key => (
            <Kbd key={key} className={tw`mr-[4px]`}>
              {normalKeyBeautify(key)}
            </Kbd>
          ));
        }

        return <Kbd className={tw`mr-[4px]`}>{normalKeyBeautify(normalKey)}</Kbd>;
      })();

      return (
        <div>
          {modifierKeyJSX}
          {normalKeyJSX && modifierKeyJSX && <span className={tw`mx-[3px]`}>+</span>}
          {normalKeyJSX}
        </div>
      );
    }
  })();

  return (
    <div className={tw`box-border p-[8px]`}>
      <div className={tw`flex`}>
        <Select
          value={activeHotkeyType}
          data={[
            { value: 'local', label: '本地' },
            { value: 'user', label: '用户', disabled: !userLoggedIn }
          ]}
          className={tw`w-[200px] mr-[5px]`}
          onChange={value => {
            hotkeyActions.setActiveHotkeyType(value as any);
          }}
        />

        <Tooltip label={`同步至「${activeHotkeyIsLocal ? '用户' : '本地'}」中`}>
          <Button
            loading={userSaveSettingLoading}
            disabled={activeHotkeyIsLocal && !userLoggedIn}
            onClick={syncHotkey}
          >
            同步
          </Button>
        </Tooltip>
      </div>
      <Divider my="xs" labelPosition="center" />
      <Table>
        <thead>
          <tr>
            <th>命令</th>
            <th>快捷快捷键</th>
            <th>源</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <ContextMenu contextRef={contextMenuRef} />
    </div>
  );

  async function syncHotkey() {
    if (activeHotkeyIsLocal) {
      const mergedUserHotkeyMap = hotkeyActions.syncHotkeyMap('local', 'user', 'merge');

      hotkeyActions.setUserHotkeyMap(mergedUserHotkeyMap);

      await userSaveSetting({ type: 'shortcut', params: mergedUserHotkeyMap });

      showNotification({
        title: '操作成功',
        message: '快捷键已同步至「用户」内',
        color: 'green'
      });
    } else {
      hotkeyActions.syncHotkeyMap('user', 'local', 'merge');

      showNotification({
        title: '操作成功',
        message: '快捷键已同步至「本地」内',
        color: 'green'
      });
    }
  }
};

export default memo(ViewKeyboardShortcut);
