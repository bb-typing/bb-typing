import { toggleSpotlight } from '@mantine/spotlight';
import { actionController } from '@ui/core/action/';

actionController.subscribe('open-search-modal', () => {
  toggleSpotlight();
});
