import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { HotkeyStoreActions, HotkeyStoreState } from './types';
import { defaultHotkeysInitializer } from './utils';

type Store = HotkeyStoreState & HotkeyStoreActions;

export const useHotkeyStore = create<
  Store,
  [['zustand/persist', Partial<HotkeyStoreState>], ['zustand/immer', HotkeyStoreState]]
>(
  persist(
    immer(set => ({
      //#region  //*=========== state ===========
      defaultHotkeyMap: defaultHotkeysInitializer(),
      userHotkeyMap: {},
      //#endregion  //*======== state ===========
      //#region  //*=========== action ===========

      setUserHotkeyMap: userHotkeyMap =>
        set(state => {
          state.userHotkeyMap = userHotkeyMap;
        })

      //#endregion  //*======== action ===========
    })),
    {
      name: 'bb-store-hotkey',
      partialize: state => ({ userHotkeyMap: state.userHotkeyMap })
    }
  )
);

export const useTrackedHotkeyState = createTrackedSelector(useHotkeyStore);
