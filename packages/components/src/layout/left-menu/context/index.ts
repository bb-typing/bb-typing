import produce from 'immer';
import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import type { Context, Store } from './types';

const useStore = create<Store.State & Store.Action>(set => ({
  foldingStatus: 'icon',

  setFoldingStatus: value =>
    set(
      produce((state: Store.State) => {
        state.foldingStatus = value;
      })
    )
}));

function getStoreState() {
  return useStore.getState();
}

export function useContext(): Context {
  const useStoreState = createTrackedSelector<Store.State>(useStore);

  const updateFoldingStatus: Context['updateFoldingStatus'] = status => {
    const { setFoldingStatus } = getStoreState();

    setFoldingStatus(status);
  };

  return {
    useStoreState,
    updateFoldingStatus
  };
}
