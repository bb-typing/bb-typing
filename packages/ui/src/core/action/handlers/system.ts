import { useThemeStore } from '@ui/stores/theme';

import { actionController } from '../controller';

actionController.subscribe('system:switch-theme-color', () => {
  useThemeStore.getState().toggleColorScheme();
});
