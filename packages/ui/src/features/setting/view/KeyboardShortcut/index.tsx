import { Kbd, Table } from '@mantine/core';
import { useTrackedHotkeyState } from '@ui/core/hotkey/';
import type { HotkeyContent } from '@ui/core/hotkey/types';
import useThemeStyle from '@ui/styles/useThemeStyle';
import { modifierKeyBeautify, normalKeyBeautify } from '@ui/utils/keyboard-shortcut';
import { useMount } from 'ahooks';
import React, { memo, useMemo, useRef } from 'react';
import { tw } from 'twind';

import 'react-contexify/dist/ReactContexify.css';

import type { ContextMenuProps } from './ContextMenu';
import ContextMenu from './ContextMenu';
import { convertToRenderSource } from './utils';
import { apiUserShortcutGet } from '../../api/apis';

interface ViewShortcutKeyProps {}

const ViewKeyboardShortcut: React.FC<ViewShortcutKeyProps> = props => {
  const { userHotkeyMap } = useTrackedHotkeyState();
  const contextMenuRef = useRef() as ContextMenuProps['contextRef'];
  const t = useThemeStyle();

  useMount(() => {
    apiUserShortcutGet({
      urlPlaceholder: {
        type: 'shortcut'
      }
    });
  });

  const renderSource = useMemo(
    () => convertToRenderSource(userHotkeyMap),
    [userHotkeyMap]
  );

  const rows = (() => {
    const result: React.ReactNode[] = [];

    Object.entries(renderSource).map(([actionName, shortcuts]) => {
      shortcuts.forEach(shortcut => {
        const isUserDefined = shortcut.type === 'user';
        const hasHotkeyContent = shortcut.hotkeyContent !== undefined;

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
            <td>
              {isUserDefined
                ? shortcut.status === 'delete'
                  ? '-'
                  : renderShortcuts(shortcut.hotkeyContent!)
                : hasHotkeyContent
                ? renderShortcuts(shortcut.hotkeyContent!)
                : '-'}
            </td>
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
    <>
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
    </>
  );
};

export default memo(ViewKeyboardShortcut);
