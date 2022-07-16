import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface AppLayoutTabsStoreState {}

interface AppLayoutTabsStoreActions {}

export const useAppLayoutTabsStore = create(immer<AppLayoutTabsStoreState & AppLayoutTabsStoreActions>(set => ({})));

export const useTrackedAppLayoutTabsStore = createTrackedSelector(useAppLayoutTabsStore);
