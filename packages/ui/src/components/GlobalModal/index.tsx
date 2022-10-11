import CommandMenu from './CommandMenu';
import UserLoginModal from '../../features/user/components/LoginModal';
import UserRegisterModal from '../../features/user/components/RegisterModal';

interface GlobalModalProps {}

function GlobalModal(props: GlobalModalProps): JSX.Element {
  return (
    <>
      <CommandMenu />
      <UserLoginModal />
      <UserRegisterModal />
    </>
  );
}

export default GlobalModal;
