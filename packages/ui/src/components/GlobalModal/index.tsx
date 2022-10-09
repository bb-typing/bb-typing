import CommandMenu from './CommandMenu';
import UserLoginModal from '../../features/user/components/UserLoginModal';

interface GlobalModalProps {}

function GlobalModal(props: GlobalModalProps): JSX.Element {
  return (
    <>
      <CommandMenu />
      <UserLoginModal />
    </>
  );
}

export default GlobalModal;
