import { showNotification } from '@mantine/notifications';
import { actionHandlersInitializer } from '@ui/core/action';
import { apiUserCheckToken } from '@ui/features/user/api/apis';
import { useComputedUserState, useUserActions } from '@ui/features/user/store';
import { useMount } from 'ahooks';

actionHandlersInitializer();

interface GlobalInitializeProviderProps {
  children?: React.ReactNode;
}

function GlobalInitializeProvider(props: GlobalInitializeProviderProps): JSX.Element {
  const { userLoggedIn } = useComputedUserState();
  const { clearUserInfo, loggedInUserInitializer, userLogout } = useUserActions();

  useMount(function userInitializer() {
    if (userLoggedIn) {
      apiUserCheckToken({
        popupErrorPrompt: false
      })
        .then(() => {
          loggedInUserInitializer();
        })
        .catch(() => {
          showNotification({
            title: '异常提示',
            color: 'red',
            message: '身份信息已过期，请重新登录'
          });
          clearUserInfo();
        });
    } else {
      // 以防万一，怕用户偷偷搞事
      userLogout();
    }
  });

  return <>{props.children}</>;
}

export default GlobalInitializeProvider;
