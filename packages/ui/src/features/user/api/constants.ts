import { defineVariables } from '@shared/types/base';
import type { MutationKey, QueryKey } from 'react-query';

export const queryKey = defineVariables<Record<string, QueryKey | MutationKey>>()({
  userLogin: 'user-login'
});
