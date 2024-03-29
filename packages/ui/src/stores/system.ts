import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface SystemStoreState {
  version: string;
}

interface SystemStoreAction {}

type Store = SystemStoreState & SystemStoreAction;

export const useSystemStore = create<
  Store,
  [['zustand/persist', Partial<SystemStoreState>], ['zustand/immer', Store]]
>(
  persist(
    immer(set => ({
      //#region  //*=========== state ===========
      version: '0.0.0'
      //#endregion  //*======== state ===========
    })),
    {
      name: 'bb-store-system',
      partialize: state => ({ version: state.version })
    }
  )
);

export const useTrackedSystemStore = createTrackedSelector(useSystemStore);
