import { defineVariables } from '@shared/types/base';
import type { MutationKey, QueryKey } from 'react-query';

export const userQueryKey = defineVariables<Record<string, QueryKey | MutationKey>>()({
  userLogin: 'user-login',
  userRegister: 'user-register',
  userSetting: 'user-setting'
});
