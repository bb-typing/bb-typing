import produce from 'immer';
import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';

export type { SystemStoreState };

export { getSystemStore, useSystemStore };

interface SystemStoreState {
  currentLocale: string;
}

interface SystemStoreActions {
  setCurrentLocale(locale: SystemStoreState['currentLocale']): void;
}

const systemStore = create<SystemStoreState & SystemStoreActions>(set => ({
  currentLocale: 'zh-CN',
  setCurrentLocale: locale =>
    set(
      produce((state: SystemStoreState) => {
        state.currentLocale = locale;
      })
    )
}));

const useSystemStore = createTrackedSelector(systemStore);
const getSystemStore = () => ({ ...systemStore });
