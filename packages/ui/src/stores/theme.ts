import type { ColorScheme } from '@mantine/core';
import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface ThemeStoreState {
  colorScheme: ColorScheme;
}

interface ThemeStoreActions {
  toggleColorScheme(colorScheme?: ColorScheme): void;
}

interface ThemeStoreComputed {
  isDark: boolean;
}

type Store = ThemeStoreState & ThemeStoreActions;

export const useThemeStore = create<
  Store,
  [['zustand/persist', Partial<ThemeStoreState>], ['zustand/immer', Store]]
>(
  persist(
    immer(set => ({
      //#region  //*=========== state ===========

      colorScheme: 'light',
      //#endregion  //*======== state ===========

      //#region  //*=========== actions ===========

      toggleColorScheme: colorScheme =>
        set(state => {
          if (colorScheme) {
            state.colorScheme = colorScheme;
          } else {
            state.colorScheme = state.colorScheme === 'light' ? 'dark' : 'light';
          }
        })

      //#endregion  //*======== actions ===========
    })),
    {
      name: 'bb-store-theme',
      partialize: state => ({ colorScheme: state.colorScheme })
    }
  )
);

export const useTrackedThemeState = createTrackedSelector<ThemeStoreState>(useThemeStore);

export const useComputedThemeState = (): ThemeStoreComputed => {
  const getState = useTrackedThemeState;

  return {
    get isDark() {
      return getState().colorScheme === 'dark';
    }
  };
};
