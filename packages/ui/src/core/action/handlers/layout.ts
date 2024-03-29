import { useAppLayoutStore } from '@ui/stores/app-layout';

import { actionController } from '../controller';

export function loadLayoutActionHandlers() {
  actionController.subscribe('layout:sidebar-switch', () => {
    const { switchSidebarVisible } = useAppLayoutStore.getState();

    switchSidebarVisible();
  });
}
