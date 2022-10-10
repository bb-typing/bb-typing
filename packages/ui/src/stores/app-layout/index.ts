import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface AppLayoutStoreState {
  sidebarFoldStatus: 'hide' | 'icon' | 'icon-text';
}

interface AppLayoutStoreAction {
  setSidebarFoldStatus(selectedStatus: AppLayoutStoreState['sidebarFoldStatus']): void;
  switchSidebarVisible(): void;
}

export const useAppLayoutStore = create(
  immer<AppLayoutStoreState & AppLayoutStoreAction>(set => ({
    sidebarFoldStatus: 'icon',

    setSidebarFoldStatus: selectedStatus =>
      set(state => {
        state.sidebarFoldStatus = selectedStatus;
      }),
    switchSidebarVisible: () =>
      set(state => {
        state.sidebarFoldStatus = state.sidebarFoldStatus === 'hide' ? 'icon' : 'hide';
      })
  }))
);

export const useTrackedAppLayoutStore = createTrackedSelector(useAppLayoutStore);
