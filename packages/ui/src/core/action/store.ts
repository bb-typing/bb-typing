import { useComputedUserState } from '@ui/features/user/store';
import { Platform } from '@ui/utils/platform';
import _ from 'lodash';
import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { actionController } from './controller';
import type {
  ActionConfigName,
  ActionConfigOption,
  ActionStoreAction,
  ActionStoreComputed,
  ActionStoreState
} from './types';

type Store = ActionStoreState & ActionStoreAction;

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

export const useComputedActionState = (): ActionStoreComputed => {
  const useState = useTrackedActionStore;

  return {
    get usableActions() {
      const actionConfigModules = actionController.getActions();
      const usableActions: ActionConfigOption[] = [];
      const { activeScopes } = useState();

      type IgnoreActionNames = Array<
        ActionConfigName | [name: ActionConfigName, ignore: boolean]
      >;
      const ignoreActionNames: IgnoreActionNames = (() => {
        const { userLoggedIn } = useComputedUserState();

        const names: IgnoreActionNames = [
          'system:open-search-modal',
          ['system:open-user-login', userLoggedIn],
          ['user:exit-current-login', !userLoggedIn]
        ];

        return names;
      })();

      actionConfigModules.forEach(module => {
        const isActiveScope = activeScopes.includes(module.scope);

        if (!isActiveScope) return;

        module.configs.forEach(config => {
          const isSupportedPlatform = config.supportedPlatforms.includes(
            Platform.OS as any
          );
          const isIgnoredAction = ignoreActionNames.some(item => {
            if (Array.isArray(item)) {
              const [name, ignore] = item;

              return config.name === name && ignore;
            }

            return config.name === item;
          });

          if (isSupportedPlatform && !isIgnoredAction) {
            usableActions.push(config);
          }
        });
      });

      return usableActions;
    }
  };
};
