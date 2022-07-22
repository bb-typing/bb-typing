import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

import type { ActionConfigScope } from './types';

export interface ActionStoreState {
  activeScopes: ActionConfigScope[];
}

interface ActionStoreActions {
  addActiveScope: (scope: ActionConfigScope) => void;
}

export const useActionStore = create(
  immer<ActionStoreState & ActionStoreActions>(set => ({
    //#region  //*=========== state ===========
    activeScopes: [],
    //#endregion  //*======== state ===========

    //#region  //*=========== action ===========
    addActiveScope: scope =>
      set(state => {
        const includeScopeInActives = state.activeScopes.includes(scope);

        if (includeScopeInActives) {
          state.activeScopes.push(scope);
        }
      })
    //#endregion  //*======== action ===========
  }))
);

export const useTrackedActionStore = createTrackedSelector(useActionStore);
