import { appHistory } from '@ui/router';

import { actionController } from '../controller';

export function loadNavigationActionHandlers() {
  actionController.subscribe('navigation:open-keyboard-shortcuts', () => {
    appHistory.push('/setting/keyboard-shortcut');
  });
}
