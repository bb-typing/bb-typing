import { useMutation } from 'react-query';

import { apiUserRegister } from '../apis';
import { userQueryKey } from '../constants';
import type { UserRegisterFormSchema } from '../../model';

type UseUserRegisterMutation = typeof useMutation<
  APIUser.Register.Resp,
  unknown,
  UserRegisterFormSchema
>;
type UserLoginMutationOptions = Parameters<UseUserRegisterMutation>[2];

export function useUserRegisterAPI(options?: UserLoginMutationOptions) {
  const _useMutation = useMutation as UseUserRegisterMutation;

  return _useMutation({
    mutationKey: userQueryKey.userRegister,
    mutationFn: params => apiUserRegister({ params }),
    ...options
  });
}
