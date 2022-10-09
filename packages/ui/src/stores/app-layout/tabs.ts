import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface AppLayoutTabsStoreState {}

interface AppLayoutTabsStoreAction {}

export const useAppLayoutTabsStore = create(
  immer<AppLayoutTabsStoreState & AppLayoutTabsStoreAction>(set => ({}))
);

export const useTrackedAppLayoutTabsStore = createTrackedSelector(useAppLayoutTabsStore);
