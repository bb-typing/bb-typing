import { toggleSpotlight } from '@mantine/spotlight';
import { useThemeStore } from '@ui/stores/theme';

import { actionController } from '../controller';

actionController.subscribe('system:switch-theme-color', () => {
  useThemeStore.getState().toggleColorScheme();
});

actionController.subscribe('system:open-search-modal', () => {
  toggleSpotlight();
});

//#region  //*=========== Desktop ===========
actionController.subscribe('system:desktop:close-app', () => {
  // window.mainProcessAPI.test();
});
//#endregion  //*======== Desktop ===========
