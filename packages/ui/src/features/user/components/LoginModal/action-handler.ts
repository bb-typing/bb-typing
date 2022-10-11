import { actionController } from '@ui/core/action';

import { useStore } from './store';

actionController.subscribe('system:open-user-login', () => {
  useStore.getState().setVisible(true);
});
