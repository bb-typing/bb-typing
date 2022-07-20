import React from 'react';
import type { KeyMap } from 'react-hotkeys';
import { HotKeys } from 'react-hotkeys';

interface WelcomeProps {}

type a = UIEvent;

const Welcome: React.FC<WelcomeProps> = () => {
  return (
    <div>
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
              MOVE_UP_1: 'c'
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

      <HotKeys
        keyMap={{
          MOVE_UP: 'c'
        }}
        handlers={{
          MOVE_UP: event => console.log('我是cccccccccc')
        }}
      >
        <input />
        哦哦哦2
      </HotKeys>
    </div>
  );
};

export default Welcome;
