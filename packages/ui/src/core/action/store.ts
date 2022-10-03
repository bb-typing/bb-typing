import _ from 'lodash';
import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { ActionStoreActions, ActionStoreState } from './types';

type Store = ActionStoreState & ActionStoreActions;

export const useActionStore = create<
  Store,
  [['zustand/persist', Store], ['zustand/immer', Store]]
>(
  persist(
    immer(set => ({
      //#region  //*=========== state ===========
      activeScopes: [],
      //#endregion  //*======== state ===========

      //#region  //*=========== action ===========
      addActiveScope: scope =>
        set(state => {
          const includeScopeInActives = state.activeScopes.includes(scope);

          if (!includeScopeInActives) {
            state.activeScopes.push(scope);
          }
        }),
      delActiveScope: scope =>
        set(state => {
          const indexToDel = state.activeScopes.indexOf(scope);

          if (indexToDel !== -1) {
            state.activeScopes.splice(indexToDel, 1);
          }
        })
      //#endregion  //*======== action ===========
    })),
    {
      name: 'bb-store-action',
      partialize: state => _.pick<any, keyof ActionStoreState>(state, []) as any
    }
  )
);

export const useTrackedActionStore = createTrackedSelector(useActionStore);
