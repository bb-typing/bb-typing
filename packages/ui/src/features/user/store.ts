import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface UserStoreState {
  userInfo: null | {
    id: string;
  };
}

interface UserStoreAction {}

type Store = UserStoreState & UserStoreAction;

export const useUserStore = create<
  Store,
  [['zustand/persist', Partial<UserStoreState>], ['zustand/immer', UserStoreState]]
>(
  persist(
    immer(set => ({
      //#region  //*=========== state ===========
      userInfo: null
      //#endregion  //*======== state ===========
      //#region  //*=========== action ===========
      //#endregion  //*======== action ===========
    })),
    {
      name: 'bb-store-user',
      partialize: state => {
        return {};
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
