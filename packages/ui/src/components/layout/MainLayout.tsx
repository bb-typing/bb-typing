import { Loading } from '@nextui-org/react';
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { tw } from 'twind';

interface MainLayoutProps {}

const navs: Array<{ link: string; label: React.ReactNode }> = [
  {
    label: '哦',
    link: '/setting/shortcut-key'
  }
];

const MainLayout: React.FC<MainLayoutProps> = () => {
  return (
    <div className={tw`w-full h-[100vh] flex justify-center`}>
      <div className={tw`w-[250px] flex(& col) items-center box-border py-[10px]`}>
        {navs.map(item => (
          <Link key={item.link} to={item.link}>
            {item.label}
          </Link>
        ))}
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
