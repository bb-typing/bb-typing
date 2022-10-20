import { actionController } from '@ui/core/action';

import { useStore } from './store';

actionController.subscribe('user:open-register', () => {
  useStore.getState().setVisible(true);
});
