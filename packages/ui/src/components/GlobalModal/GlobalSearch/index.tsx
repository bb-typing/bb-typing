import { Modal, useMantineTheme } from '@mantine/core';
import './action-handler';

import { useGlobalSearchModalStore } from './store';

interface GlobalSearchModalProps {}

function GlobalSearchModal(props: GlobalSearchModalProps): JSX.Element {
  const { toggleVisible, visible } = useGlobalSearchModalStore();
  const theme = useMantineTheme();

  return (
    <Modal
      overlayColor={
        theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      opened={visible}
      onClose={toggleVisible}
    >
      搜索框噢
    </Modal>
  );
}

export default GlobalSearchModal;
