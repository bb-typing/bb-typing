import MainLayout from '@ui/components/layout/MainLayout';
import Welcome from '@ui/components/Welcome';
import { SettingRoutes } from '@ui/features/setting/routes';
import { useRoutes } from 'react-router-dom';

export function Routes(): JSX.Element {
  const element = useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: '/', element: <Welcome /> },
        { path: '/setting/*', element: <SettingRoutes /> }
      ]
    }
  ]);

  return <>{element}</>;
}
