import { useHotkeyStore } from '@ui/core/hotkey';
import { pick } from 'lodash';
import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { apiGetUserSetting } from './api/apis';

interface UserStoreState {
  userInfo: null | {
    token: string;
  };
  userIsBeingInitialized: boolean;
}

interface UserStoreActions {
  setUserInfo: (userInfo: UserStoreState['userInfo']) => void;
  clearUserInfo: () => void;
  userLogout: () => void;
  loggedInUserInitializer: () => void;
}

type Store = UserStoreState & UserStoreActions;

export const useUserStore = create<
  Store,
  [['zustand/persist', Partial<UserStoreState>], ['zustand/immer', UserStoreState]]
>(
  persist(
    immer((set, get) => ({
      //#region  //*=========== state ===========
      userInfo: null,
      userIsBeingInitialized: false,
      //#endregion  //*======== state ===========

      //#region  //*=========== actions ===========
      setUserInfo: (userInfo: UserStoreState['userInfo']) => {
        set(state => {
          state.userInfo = userInfo;
        });
      },
      clearUserInfo: () => {
        set(state => {
          state.userInfo = null;
        });
      },
      userLogout: () => {
        get().clearUserInfo();

        useHotkeyStore.getState().cleanUserHotkeyMap();
        useHotkeyStore.getState().setActiveHotkeyType('local');
      },
      loggedInUserInitializer: () => {
        set(async state => {
          state.userIsBeingInitialized = true;

          try {
            await Promise.all([
              void (async function userSettingInitializer() {
                const shortcutSetting = await apiGetUserSetting({
                  urlPlaceholder: { type: 'shortcut' }
                });

                useHotkeyStore.getState().setUserHotkeyMap(shortcutSetting);
                useHotkeyStore.getState().setActiveHotkeyType('user');
              })()
            ]);
          } catch (error) {
            console.error(error);
          } finally {
            state.userIsBeingInitialized = false;
          }
        });
      }

      //#endregion  //*======== actions ===========
    })),
    {
      name: 'bb-store-user',
      partialize: state => {
        return pick(state, ['userInfo']);
      }
    }
  )
);

export const useTrackedUserState = createTrackedSelector<UserStoreState>(useUserStore);

export const useUserActions = (): UserStoreActions => {
  return useUserStore.getState();
};

interface UserStoreComputed {
  userLoggedIn: boolean;
}

export const useComputedUserState = (): UserStoreComputed => {
  const getState = useTrackedUserState;

  return {
    get userLoggedIn() {
      return getState().userInfo !== null;
    }
  };
};
