import { pick } from 'lodash';
import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { FormSchema } from '.';

interface StoreState {
  visible: boolean;
  formValues: FormSchema;
}

interface StoreAction {
  setVisible: (visible: boolean) => void;
  setFormValues: (formValues: FormSchema) => void;
}

interface StoreComputed {}

type Store = StoreState & StoreAction;

export const useStore = create<
  Store,
  [['zustand/persist', Partial<StoreState>], ['zustand/immer', Store]]
>(
  persist(
    immer(set => ({
      //#region  //*=========== state ===========
      visible: false,
      formValues: {
        username: '',
        password: '',
        rememberPassword: false
      },
      //#endregion  //*======== state ===========
      //
      //#region  //*=========== action ===========
      setVisible: visible =>
        set(state => {
          state.visible = visible;
        }),
      setFormValues: formValues =>
        set(state => {
          state.formValues = formValues;
        })
      //#endregion  //*======== action ===========
    })),
    {
      name: 'bb-store-user-login',
      partialize: _ => {
        const state: StoreState = _;
        const formValues: FormSchema = {
          password: '',
          username: '',
          rememberPassword: state.formValues.rememberPassword
        };

        if (state.formValues.rememberPassword) {
          Object.assign(formValues, pick(state.formValues, ['username', 'password']));
        }

        return {
          formValues
        };
      }
    }
  )
);

export const useTrackedState = createTrackedSelector<StoreState>(useStore);

export const useComputedState = (): StoreComputed => {
  const getState = useTrackedState;

  return {};
};
