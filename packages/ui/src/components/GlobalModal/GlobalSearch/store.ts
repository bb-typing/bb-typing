import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

export namespace GlobalSearchModalStore {
  export interface State {
    visible: boolean;
  }

  export interface Actions {
    toggleVisible(): void;
  }
}

export const useGlobalSearchModalStore = create(
  immer<GlobalSearchModalStore.State & GlobalSearchModalStore.Actions>(set => ({
    //#region  //*=========== state ===========
    visible: false,
    //#endregion  //*======== state ===========

    toggleVisible: () =>
      set(state => {
        state.visible = !state.visible;
      })
  }))
);

export const useTrackedGlobalSearchModalStore = createTrackedSelector(
  useGlobalSearchModalStore
);
