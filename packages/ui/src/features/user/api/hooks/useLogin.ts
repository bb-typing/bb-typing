import { showNotification } from '@mantine/notifications';
import { useMutation } from 'react-query';

import { apiUserLogin } from '../apis';
import { queryKey } from '../constants';
import type { UserLoginFormSchema } from '../../model';
import { useUserStore } from '../../store';

type UseUserLoginMutation = typeof useMutation<
  APIUser.Login.Resp,
  unknown,
  UserLoginFormSchema
>;
type UserLoginMutationOptions = Parameters<UseUserLoginMutation>[2];

export function useUserLogin(options?: UserLoginMutationOptions) {
  const _useMutation = useMutation as UseUserLoginMutation;
  const { onSuccess, ...otherOptions } = options || {};

  return _useMutation({
    mutationKey: queryKey.userLogin,
    mutationFn: params =>
      apiUserLogin({
        params,
        popupErrorPrompt: {
          title: '登录失败'
        }
      }),
    onSuccess(data, variables, context) {
      useUserStore.getState().setUserInfo({ token: data! });
      showNotification({
        title: '登录成功',
        message: '欢迎回来',
        color: 'green'
      });

      onSuccess?.(data, variables, context);
    },
    ...otherOptions
  });
}
