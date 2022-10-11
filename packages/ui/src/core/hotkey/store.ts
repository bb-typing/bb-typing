import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { HotkeyStoreAction, HotkeyStoreComputed, HotkeyStoreState } from './types';
import {
  defaultHotkeysInitializer,
  filterHotkeyMapByPlatform,
  filterHotkeyPlatform
} from './utils';

type Store = HotkeyStoreState & HotkeyStoreAction;

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

export const useTrackedHotkeyState =
  createTrackedSelector<HotkeyStoreState>(useHotkeyStore);

export const useComputedHotkeyState = (): HotkeyStoreComputed => {
  const getState = useTrackedHotkeyState;

  return {
    get currentPlatformLatestUsableHotkeyInfoMap() {
      const result: HotkeyStoreComputed['currentPlatformLatestUsableHotkeyInfoMap'] = {};

      const { defaultHotkeyMap, userHotkeyMap } = getState();
      const currentHotkeyPlatform = filterHotkeyPlatform();

      const defaultPlatformHotkeyMap = filterHotkeyMapByPlatform(
        defaultHotkeyMap,
        currentHotkeyPlatform
      );

      Object.entries(defaultPlatformHotkeyMap).forEach(
        ([actionName, defaultHotkeyInfos]) => {
          const userDefinedHotkeyInfos =
            userHotkeyMap?.[actionName]?.[currentHotkeyPlatform!];
          const defaultHotkeyInfo = defaultHotkeyInfos?.at(-1);

          if (userDefinedHotkeyInfos) {
            const userHighestPriorityHotkeyInfo = userDefinedHotkeyInfos
              .sort((a, b) => a.updateTime - b.updateTime)
              .find(hotkeyInfo => hotkeyInfo.status === 'enable');

            result[actionName] = (userHighestPriorityHotkeyInfo ||
              defaultHotkeyInfo) as any;
          } else {
            result[actionName] = defaultHotkeyInfo as any;
          }

          if (result[actionName] === undefined) {
            delete result[actionName];
          }
        }
      );

      return result;
    }
  };
};
