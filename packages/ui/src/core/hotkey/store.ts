import _ from 'lodash';
import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { HotkeyStoreActions, HotkeyStoreState } from './types';
import { defaultHotkeysInitializer } from './utils';

type Store = HotkeyStoreState & HotkeyStoreActions;

export const useHotkeyStore = create<
  Store,
  [['zustand/persist', Store], ['zustand/immer', Store]]
>(
  persist(
    immer(set => ({
      //#region  //*=========== state ===========
      defaultHotkeyMap: defaultHotkeysInitializer(),
      localHotkeyMap: {},
      userHotkeyMap: {}
      //#endregion  //*======== state ===========
      //#region  //*=========== action ===========

      //#endregion  //*======== action ===========
    })),
    {
      name: 'bb-store-hotkey',
      partialize: state =>
        _.pick<any, keyof HotkeyStoreState>(state, [
          'localHotkeyMap',
          'userHotkeyMap'
        ]) as any
    }
  )
);

export const useTrackedHotkeyStore = createTrackedSelector(useHotkeyStore);
