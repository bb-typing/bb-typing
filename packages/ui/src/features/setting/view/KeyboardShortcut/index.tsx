import { Kbd, Table } from '@mantine/core';
import { useTrackedHotkeyState } from '@ui/core/hotkey/';
import type { HotkeyContent } from '@ui/core/hotkey/types';
import React, { memo, useMemo } from 'react';
import { tw } from 'twind';

import { convertToRenderSource } from './utils';

interface ViewShortcutKeyProps {}

const ViewKeyboardShortcut: React.FC<ViewShortcutKeyProps> = props => {
  const { defaultHotkeyMap, userHotkeyMap } = useTrackedHotkeyState();

  const renderSource = useMemo(() => {
    return convertToRenderSource(defaultHotkeyMap, userHotkeyMap);
  }, [defaultHotkeyMap, userHotkeyMap]);

  const rows = (() => {
    const result: React.ReactNode[] = [];

    Object.entries(renderSource).map(([actionName, shortcuts]) => {
      shortcuts.forEach(shortcut => {
        if (shortcut.type === 'default') {
          result.push(
            <tr key={actionName}>
              <td>{shortcut.actionConfig.commands[1]}</td>
              <td>{renderShortcuts(shortcut.hotkeyContent)}</td>
              <td>默认</td>
            </tr>
          );
        } else {
          result.push(
            <tr key={actionName}>
              <td>{shortcut.actionConfig.commands[1]}</td>
              <td>{renderShortcuts(shortcut.hotkeyContent)}</td>
              <td>用户</td>
            </tr>
          );
        }
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
              {key}
            </Kbd>
          ));
        }

        return <Kbd className={tw`mr-[4px]`}>{modifierKey}</Kbd>;
      })();

      return (
        <div className={tw``}>
          {modifierKeyJSX}
          <span className={tw`mx-[3px]`}>+</span>
          <Kbd>{normalKey}</Kbd>
        </div>
      );
    }
  })();

  return (
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
  );
};

export default memo(ViewKeyboardShortcut);
