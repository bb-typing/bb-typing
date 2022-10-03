import { Outlet } from 'react-router-dom';
import { tw } from 'twind';

interface AppLayoutContentProps {}

function AppLayoutContent(props: AppLayoutContentProps): JSX.Element {
  return (
    <div className={tw`flex-1 w-full`}>
      <Outlet />
    </div>
  );
}

export default AppLayoutContent;
