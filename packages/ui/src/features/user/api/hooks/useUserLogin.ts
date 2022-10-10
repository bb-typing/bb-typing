import { apiUserLogin } from '../apis';
import { useMutation } from 'react-query';
import { queryKey } from '../constants';

import type { UserLoginFormSchema } from '../../model';

type UseUserLoginMutation = typeof useMutation<
  APIUser.Login.Resp,
  unknown,
  UserLoginFormSchema
>;
type UserLoginMutationOptions = Parameters<UseUserLoginMutation>[2];
export function useUserLoginAPI(options?: UserLoginMutationOptions) {
  const _useMutation = useMutation as UseUserLoginMutation;

  return _useMutation({
    mutationKey: queryKey.userLogin,
    mutationFn: params => apiUserLogin({ params }),
    ...options
  });
}
