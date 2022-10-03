import { toggleSpotlight } from '@mantine/spotlight';
import { actionController } from '@ui/core/action/';

actionController.subscribe('system:open-search-modal', () => {
  toggleSpotlight();
});
