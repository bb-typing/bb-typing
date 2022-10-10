import Welcome from '@ui/components/Welcome';
import UserRoutes from '@ui/features/user/Routes';
import { useRoutes } from 'react-router-dom';

import AppLayout from '../components/AppLayout';
import SettingRoutes from '../features/setting/Routes';

function Routes(): JSX.Element {
  const element = useRoutes([
    {
      path: '/',
      element: <AppLayout />,
      children: [
        { index: true, element: <Welcome /> },
        { path: '/setting/*', element: <SettingRoutes /> },
        { path: '/user/*', element: <UserRoutes /> }
      ]
    }
  ]);

  return <>{element}</>;
}

export default Routes;
