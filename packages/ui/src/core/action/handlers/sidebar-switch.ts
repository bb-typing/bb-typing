import { useAppLayoutStore } from '@ui/stores/app-layout';

import { actionController } from '../controller';

actionController.subscribe('sidebar-switch', () => {
  const { switchSidebarVisible } = useAppLayoutStore.getState();

  switchSidebarVisible();
});
