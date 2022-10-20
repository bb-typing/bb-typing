import { actionController } from '@ui/core/action';

import { useStore } from './store';

actionController.subscribe('user:open-login', () => {
  useStore.getState().setVisible(true);
});
