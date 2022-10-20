import { useUserStore } from '@ui/features/user/store';

import type { ActionConfigName } from '../types';

function actionEmitValidator(actionName: ActionConfigName, ...args: any[]): boolean {
  type SourceToVerify = Partial<Record<ActionConfigName, (...args: any[]) => boolean>>;
  const sourceToVerify: SourceToVerify = {
    'user:exit-current-login'() {
      const hasLogin = useUserStore.getState().userInfo !== null;

      return hasLogin;
    },
    'user:open-login'() {
      const notLogin = !useUserStore.getState().userInfo !== null;

      return notLogin;
    }
  };

  if (sourceToVerify[actionName]) {
    return sourceToVerify[actionName]!(...args);
  }

  return true;
}

export default actionEmitValidator;
