import { loadLayoutActionHandlers } from './layout';
import { loadNavigationActionHandlers } from './navigation';
import { loadSystemActionHandlers } from './system';
import { loadUserActionHandlers } from './user';

export function actionHandlersInitializer() {
  loadLayoutActionHandlers();
  loadUserActionHandlers();
  loadNavigationActionHandlers();
  loadSystemActionHandlers();
}
