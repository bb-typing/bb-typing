import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface AppLayoutStoreState {
  sidebarFoldStatus: 'hide' | 'icon' | 'icon-text';
}

interface AppLayoutStoreActions {
  setSidebarFoldStatus(selectedStatus: AppLayoutStoreState['sidebarFoldStatus']): void;
}

export const useAppLayoutStore = create(
  immer<AppLayoutStoreState & AppLayoutStoreActions>(set => ({
    sidebarFoldStatus: 'icon',

    setSidebarFoldStatus: selectedStatus =>
      set(state => {
        state.sidebarFoldStatus = selectedStatus;
      })
  }))
);

export const useTrackedAppLayoutStore = createTrackedSelector(useAppLayoutStore);
