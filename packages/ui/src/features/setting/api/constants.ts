import { defineVariables } from '@shared/types/base';
import type { MutationKey, QueryKey } from 'react-query';

export const settingQueryKey = defineVariables<Record<string, QueryKey | MutationKey>>()(
  {}
);
