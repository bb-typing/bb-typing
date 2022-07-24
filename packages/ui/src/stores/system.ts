import produce from 'immer';
import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface SystemStoreState {}

interface SystemStoreActions {}

export const useSystemStore = create(
  immer<SystemStoreState & SystemStoreActions>(set => ({}))
);

export const useTrackedSystemStore = createTrackedSelector(useSystemStore);
