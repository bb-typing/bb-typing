import UserLoginModal from '@ui/features/user/components/LoginModal';
import UserRegisterModal from '@ui/features/user/components/RegisterModal';

import CommandMenu from '../components/global-modal/CommandMenu';

interface GlobalModalProviderProps {
  children?: React.ReactNode;
}

function GlobalModalProvider(props: GlobalModalProviderProps): JSX.Element {
  return (
    <>
      <CommandMenu />
      <UserLoginModal />
      <UserRegisterModal />
      {props.children}
    </>
  );
}

export default GlobalModalProvider;
