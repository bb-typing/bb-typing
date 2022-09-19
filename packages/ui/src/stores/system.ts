import _ from 'lodash';
import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface SystemStoreState {
  version: string;
}

interface SystemStoreActions {}

type Store = SystemStoreState & SystemStoreActions;

export const useSystemStore = create<
  Store,
  [['zustand/persist', Store], ['zustand/immer', Store]]
>(
  persist(
    immer(set => ({
      //#region  //*=========== state ===========
      version: '0.0.0'
      //#endregion  //*======== state ===========
    })),
    {
      name: 'bb-store-system',
      partialize: state => _.pick<any, keyof SystemStoreState>(state, ['version'])
    }
  )
);

export const useTrackedSystemStore = createTrackedSelector(useSystemStore);
