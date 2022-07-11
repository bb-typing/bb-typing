import { tw } from 'twind';
import LeftMenu from './left-menu';
import { Outlet } from 'react-router-dom';

function Layout(): JSX.Element {
  return (
    <div className={tw`w-full h-[100vh] flex justify-center`}>
      <LeftMenu />
      <div className={tw`flex-1 h-full bg-[pink]`}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
