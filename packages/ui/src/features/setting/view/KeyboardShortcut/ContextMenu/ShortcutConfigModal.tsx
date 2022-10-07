import { Button, Kbd, Modal } from '@mantine/core';
import type { HotkeyContent } from '@ui/core/hotkey/types';
import useThemeStyle from '@ui/styles/useThemeStyle';
import { useSetState } from 'ahooks';
import { motion } from 'framer-motion';
import { omit } from 'lodash';
import { useImperativeHandle, useRef } from 'react';
import type { MergedModifierCode, MergedNormalCode } from 'super-hotkey';
import {
  defaultModifierCodes,
  extendedModifierCodeMap,
  extendedNormalCodeMap
} from 'super-hotkey';
import { apply, tw } from 'twind';
import { css } from 'twind/css';

export interface ShortcutConfigModalProps {
  contextRef: React.RefObject<{
    open(): void;
  }>;
  onOk(shortcut: HotkeyContent): void;
}

function ShortcutConfigModal(props: ShortcutConfigModalProps): JSX.Element {
  const { contextRef, onOk } = props;
  const t = useThemeStyle();
  const [{ visible, currentShortcut }, setStates] = useSetState({
    visible: false,
    currentShortcut: {
      modifiers: [] as MergedModifierCode[],
      normals: [] as MergedNormalCode[]
    }
  });
  const cacheData = useRef({
    hasReleasedAnyKey: true
  });
  const style = useStyle();

  useImperativeHandle(contextRef, () => ({
    open() {
      setStates({
        visible: true,
        currentShortcut: { modifiers: [], normals: [] }
      });
    }
  }));

  return (
    <Modal
      opened={visible}
      centered={true}
      onClose={() => setStates({ visible: false })}
      title="快捷键设置"
    >
      <div
        tabIndex={0}
        data-autofocus
        className={style.monitorInput}
        onKeyDown={({ nativeEvent }) => handleMonitorInputKeyDown(nativeEvent)}
        onKeyUp={({ nativeEvent }) => handleMonitorInputKeyUp(nativeEvent)}
      >
        {(() => {
          const { modifiers, normals } = currentShortcut;
          const hasModifiers = modifiers.length > 0;
          const hasNormals = normals.length > 0;

          return [
            modifiers.map(modifier => (
              <Kbd className={tw`mr-[2px]`} key={modifier}>
                {modifier.toLocaleLowerCase()}
              </Kbd>
            )),
            hasModifiers && hasNormals && <span className={tw`mx-[3px]`}>+</span>,
            normals.map(normal => (
              <Kbd className={tw`mr-[2px]`} key={normal}>
                {normal.toLocaleLowerCase()}
              </Kbd>
            ))
          ];
        })()}

        <motion.span
          className={tw`hidden w-[2px] h-[60%] bg-[${t.selector('#333', '#d8d8d8')}]`}
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        />
      </div>
      <div className={tw`text-center`}>
        <Button className={tw`w-[50%]`} color="gray" onClick={handleConfirm}>
          确定
        </Button>
      </div>
    </Modal>
  );

  function handleConfirm() {
    onOk({
      modifierKey: currentShortcut.modifiers,
      normalKey: currentShortcut.normals
    });
  }

  function handleMonitorInputKeyDown(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();

    const _currentShortcut = { ...currentShortcut };
    const eventCode = event.code as any;

    if (cacheData.current.hasReleasedAnyKey) {
      cacheData.current.hasReleasedAnyKey = false;
      _currentShortcut.modifiers = [];
      _currentShortcut.normals = [];
    }

    const isDefaultModifierCode = defaultModifierCodes.includes(eventCode);

    if (isDefaultModifierCode) {
      const [keyAlias] = Object.entries(extendedModifierCodeMap).find(
        ([keyAlias, aliasContent]) =>
          (aliasContent as any).includes(eventCode) && keyAlias.length > 2
      )! as [MergedModifierCode, any];

      const isExist = _currentShortcut.modifiers.includes(keyAlias);

      if (!isExist) {
        _currentShortcut.modifiers.push(keyAlias);
      }
    } else {
      const [keyAlias] = (Object.entries(omit(extendedNormalCodeMap, 'Return')).find(
        ([, aliasContent]) =>
          typeof aliasContent === 'string' && aliasContent === eventCode
      ) ?? []) as [MergedNormalCode, any] | [];

      const hasKeyAlias = !!keyAlias;

      if (hasKeyAlias) {
        const isExist = _currentShortcut.normals.includes(keyAlias);

        if (!isExist) {
          _currentShortcut.normals.push(keyAlias);
        }
      } else {
        const isExist = _currentShortcut.normals.includes(eventCode);

        if (!isExist) {
          _currentShortcut.normals.push(eventCode);
        }
      }
    }

    setStates({ currentShortcut: _currentShortcut });
  }

  function handleMonitorInputKeyUp(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    cacheData.current.hasReleasedAnyKey = true;
  }
}

function useStyle() {
  const t = useThemeStyle();

  return {
    monitorInput: tw(
      'w-full h-[40px] mb-[15px] flex items-center justify-center cursor-text box-border select-none',
      `border([1px] [${t.selector(t.mt.colors.dark[5], '#d8d8d8')}])`,
      `bg-[${t.selector(t.mt.colors.dark[8], '#f4f4f4')}]`,
      css`
        &:focus {
          > span {
            ${apply`inline`}
          }
          ${apply`border-[2px]`}
        }
      `
    )
  } as const;
}

export default ShortcutConfigModal;
