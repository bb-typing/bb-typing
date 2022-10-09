import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface StoreState {
  visible: boolean;
}

interface StoreAction {
  setVisible: (visible: boolean) => void;
}

interface StoreComputed {}

type Store = StoreState & StoreAction;

export const useStore = create<
  Store,
  [['zustand/persist', Partial<StoreState>], ['zustand/immer', Store]]
>(
  persist(
    immer(set => ({
      //#region  //*=========== state ===========
      visible: false,
      //#endregion  //*======== state ===========
      //#region  //*=========== action ===========
      setVisible: visible =>
        set(state => {
          state.visible = visible;
        })

      //#endregion  //*======== action ===========
      //
    })),
    {
      name: 'bb-store-theme',
      partialize: state => {
        return {};
      }
    }
  )
);

export const useTrackedState = createTrackedSelector<StoreState>(useStore);

export const useComputedState = (): StoreComputed => {
  const getState = useTrackedState;

  return {};
};
