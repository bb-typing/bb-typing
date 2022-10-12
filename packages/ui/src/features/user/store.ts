import { pick } from 'lodash';
import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface UserStoreState {
  userInfo: null | {
    token: string;
  };
}

interface UserStoreAction {
  setUserInfo: (userInfo: UserStoreState['userInfo']) => void;
  clearUserInfo: () => void;
}

type Store = UserStoreState & UserStoreAction;

export const useUserStore = create<
  Store,
  [['zustand/persist', Partial<UserStoreState>], ['zustand/immer', UserStoreState]]
>(
  persist(
    immer(set => ({
      //#region  //*=========== state ===========
      userInfo: null,
      //#endregion  //*======== state ===========

      //#region  //*=========== action ===========
      setUserInfo: (userInfo: UserStoreState['userInfo']) => {
        set(state => {
          state.userInfo = userInfo;
        });
      },
      clearUserInfo: () => {
        set(state => {
          state.userInfo = null;
        });
      }
      //#endregion  //*======== action ===========
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
