import { useMutation } from 'react-query';

import { apiSaveUserSetting } from '../apis';
import { userQueryKey } from '../constants';

type UseUserSaveSettingMutation = typeof useMutation<
  unknown,
  unknown,
  {
    type: Parameters<typeof apiSaveUserSetting>[0]['urlPlaceholder']['type'];
    params: Parameters<typeof apiSaveUserSetting>[0]['params'];
  }
>;
type UserSaveSettingMutationOptions = Parameters<UseUserSaveSettingMutation>[2];

export function useUserSaveSettingAPI(options?: UserSaveSettingMutationOptions) {
  return useMutation({
    mutationKey: userQueryKey.userSetting,
    mutationFn: ({ params, type }) => {
      return apiSaveUserSetting({
        urlPlaceholder: { type },
        params
      });
    },
    ...options
  });
}
