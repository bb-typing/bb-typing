import { useHotkeyStore } from '@ui/core/hotkey';
import type { HotkeyContent, UserHotkeyInfo } from '@ui/core/hotkey/types';
import { filterHotkeyPlatform } from '@ui/core/hotkey/utils';
import useThemeStyle from '@ui/styles/useThemeStyle';
import { useSetState } from 'ahooks';
import { useImperativeHandle, useRef } from 'react';
import { Item, Menu, Separator, useContextMenu } from 'react-contexify';
import { tw } from 'twind';
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

  const shortcutConfigModalRef = useRef() as ShortcutConfigModalProps['contextRef'];
  const style = useStyle();
  const { show: showMenu } = useContextMenu({ id: MENU_ID });

  const [{ currentShortcut }, setStates] = useSetState({
    currentShortcut: null as ShortcutRenderSourceItem | null
  });
  const cacheData = useRef({
    operationMode: 'update' as 'update' | 'add'
  });
  const currentHotkeyPlatform = filterHotkeyPlatform()!;

  useImperativeHandle(contextRef, () => ({
    open(event, currentShortcut) {
      showMenu(event);
      setStates({ currentShortcut });
    }
  }));

  return (
    <div className={style.wrapper}>
      <Menu id={MENU_ID} animation={false}>
        {(() => {
          if (!currentShortcut) return null;

          const isUserDefined = currentShortcut.type === 'user';
          const isDefaultDefined = currentShortcut.type === 'default';
          const hasDefinedHotkeyContent = currentShortcut.hotkeyContent !== undefined;

          const allowUpdate =
            hasDefinedHotkeyContent &&
            ((isUserDefined && currentShortcut.status === 'enable') || isDefaultDefined);

          const allowDisable =
            !hasDefinedHotkeyContent ||
            (isDefaultDefined && hasDefinedHotkeyContent) ||
            (isUserDefined && currentShortcut.status === 'enable');

          // 是用户定义的，且热键状态处于「启用、禁用」时，才显示「删除」项
          // 是默认定义的，且热键内容存在，才显示「删除」项
          const allowDelete =
            (isUserDefined &&
              (['enable', 'disable'] as UserHotkeyInfo['status'][]).includes(
                currentShortcut.status
              )) ||
            (isDefaultDefined && hasDefinedHotkeyContent);

          return (
            <>
              <Item onClick={updateShortcut} disabled={!allowUpdate}>
                更改键绑定
              </Item>
              <Item onClick={addShortcut}>添加键绑定</Item>
              <Separator />
              <Item onClick={disableShortcut} disabled={allowDisable}>
                禁用
              </Item>
              <Item onClick={deleteShortcut} className="delete" disabled={!allowDelete}>
                删除
              </Item>
            </>
          );
        })()}
      </Menu>
      <ShortcutConfigModal
        contextRef={shortcutConfigModalRef}
        onConfirm={handleConfiguredShortcut}
      />
    </div>
  );

  function handleConfiguredShortcut(configuredShortcut: HotkeyContent) {
    if (currentShortcut) {
      useHotkeyStore.getState().updateUserHotkeyMap(currentShortcut.actionConfig.name, {
        type: cacheData.current.operationMode,
        hotkeyContent: configuredShortcut,
        hotkeyPlatform: currentHotkeyPlatform,
        defaultOriginId:
          currentShortcut.type === 'user'
            ? currentShortcut.defaultOriginId!
            : currentShortcut.id!,

        hotkeyType: currentShortcut.type,
        hotkeyInfo: currentShortcut as any
      });
    }
  }

  function updateShortcut() {
    cacheData.current.operationMode = 'update';
    shortcutConfigModalRef.current?.open();
  }

  function addShortcut() {
    cacheData.current.operationMode = 'add';
    shortcutConfigModalRef.current?.open();
  }

  function deleteShortcut() {
    if (currentShortcut) {
      useHotkeyStore.getState().updateUserHotkeyMap(currentShortcut.actionConfig.name, {
        type: 'delete',
        hotkeyPlatform: currentHotkeyPlatform,
        defaultOriginId:
          currentShortcut.type === 'user'
            ? currentShortcut.defaultOriginId!
            : currentShortcut.id!,

        hotkeyType: currentShortcut.type,
        hotkeyInfo: currentShortcut as any
      });
    }
  }

  function disableShortcut() {
    if (currentShortcut) {
      useHotkeyStore.getState().updateUserHotkeyMap(currentShortcut.actionConfig.name, {
        type: 'delete',
        hotkeyPlatform: currentHotkeyPlatform,
        defaultOriginId:
          currentShortcut.type === 'user'
            ? currentShortcut.defaultOriginId!
            : currentShortcut.id!,

        hotkeyType: currentShortcut.type,
        hotkeyInfo: currentShortcut as any
      });
    }
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
