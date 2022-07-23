import { Button } from '@nextui-org/react';
import { useActionStore, useTrackedActionStore } from '@ui/core/action';
import { useHotkeyStore } from '@ui/core/hotkey';
import React from 'react';
import { HotKeys } from 'react-hotkeys';
import { tw } from 'twind';

interface WelcomeProps {}

const Welcome: React.FC<WelcomeProps> = () => {
  const { activeScopes, addActiveScope } = useTrackedActionStore();
  const { defaultHotkeyMap } = useHotkeyStore();

  console.log('defaultHotkeyMap', defaultHotkeyMap);

  return (
    <div>
      {JSON.stringify(activeScopes)}
      <br />

      <Button
        onClick={() => {
          addActiveScope('global');
        }}
      >
        我加加加
      </Button>
      <Button
        onClick={() => {
          useActionStore.persist.clearStorage();
        }}
      >
        清除缓存咯
      </Button>
      <div className={tw`my-[10px] h-[1px] bg-black`}></div>
      <HotKeys
        keyMap={{
          MOVE_UP: 'f3'
        }}
        handlers={{
          MOVE_UP: event => {
            event!.preventDefault();

            console.log('可是，错的是这个世界啊？');
          }
        }}
      >
        <input />t<div>三呢？</div>
        <div>
          <HotKeys
            keyMap={{
              MOVE_UP_1: ['command+k', 'ctrl+k', 'f3']
            }}
            handlers={{
              MOVE_UP_1: event => console.log('我是f3-ccc')
            }}
          >
            <input />
            哦哦哦2
          </HotKeys>
        </div>
      </HotKeys>

      {/* <HotKeys
        keyMap={{
          MOVE_UP: 'c'
        }}
        handlers={{
          MOVE_UP: event => console.log('我是cccccccccc')
        }}
      >
        <input />
        哦哦哦2
      </HotKeys> */}
    </div>
  );
};

export default Welcome;
