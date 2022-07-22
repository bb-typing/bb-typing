import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

import type { ActionConfigName } from '../action';

export interface HotkeyStoreState {
  // defaultMap: Record<ActionConfigName, >;
}

interface HotkeyStoreActions {}

export const useHotkeyStore = create(
  immer<HotkeyStoreState & HotkeyStoreActions>(set => ({
    //#region  //*=========== state ===========
    //#endregion  //*======== state ===========
    //#region  //*=========== action ===========
    // addActiveScope: scope =>
    //   set(state => {
    //     const includeScopeInActives = state.activeScopes.includes(scope);
    //     if (includeScopeInActives) {
    //       state.activeScopes.push(scope);
    //     }
    //   })
    //#endregion  //*======== action ===========
  }))
);

export const useTrackedHotkeyStore = createTrackedSelector(useHotkeyStore);
