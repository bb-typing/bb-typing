import { pick } from 'lodash';
import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { FormSchema } from '.';

interface StoreState {
  visible: boolean;
}

interface StoreAction {
  setVisible: (visible: boolean) => void;
}

interface StoreComputed {}

type Store = StoreState & StoreAction;

export const useStore = create<Store, [['zustand/immer', Store]]>(
  immer(set => ({
    //#region  //*=========== state ===========
    visible: false,

    //#endregion  //*======== state ===========
    //
    //#region  //*=========== action ===========
    setVisible: visible =>
      set(state => {
        state.visible = visible;
      })

    //#endregion  //*======== action ===========
  }))
);

export const useTrackedState = createTrackedSelector<StoreState>(useStore);

export const useComputedState = (): StoreComputed => {
  const getState = useTrackedState;

  return {};
};
