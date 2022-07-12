import { Button, Loading } from '@nextui-org/react';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { tw } from 'twind';

interface MainLayoutProps {}

const MainLayout: React.FC<MainLayoutProps> = () => {
  return (
    <div className={tw`w-full h-[100vh] flex justify-center`}>
      <div className={tw`w-[250px]`}>
        <Button>to user-page</Button>
      </div>
      <div className={tw`flex-1 h-full bg-[pink]`}>
        <React.Suspense
          fallback={
            <div className={tw`h-full w-full flex items-center justify-center`}>
              <Loading type="points" />
            </div>
          }
        >
          <Outlet />
        </React.Suspense>
      </div>
    </div>
  );
};

export default MainLayout;
