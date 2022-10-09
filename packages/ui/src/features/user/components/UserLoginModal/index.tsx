import { Modal } from '@mantine/core';
import './action-handler';

import { useStore, useTrackedState } from './store';

interface UserLoginProps {}

function UserLoginModal(props: UserLoginProps): JSX.Element {
  const { visible } = useTrackedState();
  const { setVisible } = useStore.getState();

  return (
    <Modal
      opened={visible}
      centered={true}
      onClose={() => setVisible(false)}
      title="用户登录"
    ></Modal>
  );
}

export default UserLoginModal;
