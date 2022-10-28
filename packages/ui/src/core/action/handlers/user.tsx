import type { NotificationProps } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { defineVariables } from '@shared/types/base';
import { IconCheck } from '@tabler/icons';
import { useUserStore } from '@ui/features/user/store';

import { actionController } from '../controller';

export function loadUserActionHandlers() {
  actionController.subscribe('user:exit-current-login', () => {
    const notificationProps = defineVariables<Partial<NotificationProps>>()({
      id: 'user:exit-current-login',
      styles: () => ({
        title: { marginBottom: 0 }
      })
    } as const);

    showNotification({
      loading: true,
      title: '正在退出中...',
      message: null,
      autoClose: false,
      disallowClose: true,
      ...notificationProps
    });

    setTimeout(() => {
      updateNotification({
        color: 'teal',
        title: '退出成功',
        message: null,
        icon: <IconCheck size={16} />,
        autoClose: 2000,
        ...notificationProps
      });

      useUserStore.getState().userLogout();
    }, 300);
  });
}
