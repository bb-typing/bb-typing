import MainLayout from '@ui/components/layout/MainLayout';
import Welcome from '@ui/components/Welcome';
import { useRoutes } from 'react-router-dom';
import SettingRoutes from '../features/setting/Routes';

export function Routes(): JSX.Element {
  const element = useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { index: true, element: <Welcome /> },
        { path: '/setting/*', element: <SettingRoutes /> }
      ]
    }
  ]);

  return <>{element}</>;
}
