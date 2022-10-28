import { actionController } from '@ui/core/action';

import { useStore } from './store';

export function loadActionHandler() {
  actionController.subscribe('user:open-login', () => {
    useStore.getState().setVisible(true);
  });
}
