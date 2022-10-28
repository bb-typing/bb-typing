import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

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
    //#region  //*=========== actions ===========
    setVisible: visible =>
      set(state => {
        state.visible = visible;
      })

    //#endregion  //*======== actions ===========
  }))
);

export const useTrackedState = createTrackedSelector<StoreState>(useStore);

export const useComputedState = (): StoreComputed => {
  const getState = useTrackedState;

  return {};
};
