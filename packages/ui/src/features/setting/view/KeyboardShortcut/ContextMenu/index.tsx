import type { HotkeyContent } from '@ui/core/hotkey/types';
import useThemeStyle from '@ui/styles/useThemeStyle';
import { useImperativeHandle, useRef } from 'react';
import { Item, Menu, Separator, useContextMenu } from 'react-contexify';
import { apply, tw } from 'twind';
import { css } from 'twind/css';

import type { ShortcutConfigModalProps } from './ShortcutConfigModal';
import ShortcutConfigModal from './ShortcutConfigModal';
import type { ShortcutRenderSourceItem } from '../utils';

const MENU_ID = 'keyboard-shortcut-menu';

export interface ContextMenuProps {
  contextRef: React.RefObject<{
    open(
      event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
      currentShortcut: ShortcutRenderSourceItem
    ): void;
  }>;
}

function ContextMenu(props: ContextMenuProps): JSX.Element {
  const { contextRef } = props;
  const currentShortcutRef = useRef<ShortcutRenderSourceItem>();
  const shortcutConfigModalRef = useRef() as ShortcutConfigModalProps['contextRef'];
  const style = useStyle();
  const { show: showMenu } = useContextMenu({
    id: MENU_ID
  });

  useImperativeHandle(contextRef, () => ({
    open(event, currentShortcut) {
      showMenu(event);
      currentShortcutRef.current = currentShortcut;
    }
  }));

  return (
    <div className={style.wrapper}>
      <Menu id={MENU_ID} animation={false}>
        <Item onClick={handleUpdateShortcut}>更改键绑定</Item>
        <Item onClick={handleAddShortcut}>添加键绑定</Item>
        <Separator />
        <Item onClick={handleDisableShortcut}>禁用</Item>
        <Item onClick={handleDeleteShortcut} className="delete">
          删除
        </Item>
      </Menu>
      <ShortcutConfigModal
        contextRef={shortcutConfigModalRef}
        onConfirm={handleConfiguredShortcut}
      />
    </div>
  );

  function handleConfiguredShortcut(configuredShortcut: HotkeyContent) {
    console.log('configuredShortcut', configuredShortcut);
  }

  function handleUpdateShortcut() {
    console.log('updateShortcut');
    shortcutConfigModalRef.current?.open();
  }

  function handleAddShortcut() {
    console.log('addShortcut');
  }

  function handleDeleteShortcut() {
    console.log('deleteShortcut');
  }

  function handleDisableShortcut() {
    console.log('disableShortcut');
  }
}

function useStyle() {
  const t = useThemeStyle();

  return {
    wrapper: tw(css`
      .react-contexify__item:not(.react-contexify__item--disabled):focus
        > .react-contexify__item__content {
        background-color: ${t.selector(t.mt.colors.blue[8], t.mt.colors.blue[6])};
      }

      .react-contexify__item:not(.react-contexify__item--disabled):hover
        > .react-contexify__item__content {
        background-color: ${t.selector(t.mt.colors.blue[7], t.mt.colors.blue[5])};
      }

      .react-contexify {
        background: ${t.selector(t.mt.colors.dark[6], '#fff')};
        padding: 4px;
        box-sizing: border-box;
        border: 1px solid ${t.selector(t.mt.colors.dark[4], t.mt.colors.gray[2])};

        &__separator {
          height: 0.5px;
          width: 92%;
          margin: 4px auto;
          background: ${t.selector(t.mt.colors.dark[3], t.mt.colors.gray[3])};
        }

        &__item {
          &.delete > div {
            color: #d83c3e;
          }
          &__content {
            color: ${t.selector('#fff', '#4f5660')};
            font-weight: 500;
            padding: 1px 9px;
            box-sizing: border-box;
            font-size: 14px;
            border-radius: 4px;
          }
        }
      }
    `)
  } as const;
}

export default ContextMenu;
