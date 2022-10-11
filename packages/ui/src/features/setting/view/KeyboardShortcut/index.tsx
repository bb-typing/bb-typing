import { Kbd, Table } from '@mantine/core';
import { useTrackedHotkeyState } from '@ui/core/hotkey/';
import type { HotkeyContent } from '@ui/core/hotkey/types';
import { modifierKeyBeautify } from '@ui/utils/keyboard-shortcut';
import React, { memo, useMemo, useRef } from 'react';
import { tw } from 'twind';

import 'react-contexify/dist/ReactContexify.css';

import type { ContextMenuProps } from './ContextMenu';
import ContextMenu from './ContextMenu';
import { convertToRenderSource } from './utils';

interface ViewShortcutKeyProps {}

const ViewKeyboardShortcut: React.FC<ViewShortcutKeyProps> = props => {
  const { userHotkeyMap } = useTrackedHotkeyState();
  const contextMenuRef = useRef() as ContextMenuProps['contextRef'];

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
          return modifierKey.map(key => (
            <Kbd key={key} className={tw`mr-[4px]`}>
              {modifierKeyBeautify(key)}
            </Kbd>
          ));
        }

        return <Kbd className={tw`mr-[4px]`}>{modifierKeyBeautify(modifierKey)}</Kbd>;
      })();

      return (
        <div>
          {modifierKeyJSX}
          <span className={tw`mx-[3px]`}>+</span>
          <Kbd>{normalKey}</Kbd>
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
