import Welcome from '@ui/components/Welcome';
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
        { path: '/setting/*', element: <SettingRoutes /> }
      ]
    }
  ]);

  return <>{element}</>;
}

export default Routes;
