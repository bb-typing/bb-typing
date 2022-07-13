import React from 'react';
import { tw } from 'twind';

import AppLayoutContent from './Content';
import AppLayoutSidebar from './Sidebar';
import AppLayoutTabs from './Tabs';

function AppLayout(): JSX.Element {
  return (
    <div className={tw`h-screen w-screen flex`}>
      <AppLayoutSidebar />
      {/* #region  //*=========== Right =========== */}
      <div className={tw`flex(& 1 col)`}>
        <AppLayoutTabs />
        <AppLayoutContent />
      </div>
      {/* #endregion  //*======== Right =========== */}
    </div>
  );
  // return (
  //   <div className={tw`w-full h-[100vh] flex justify-center`}>
  //     <div className={tw`w-[250px] flex(& col) items-center box-border py-[10px]`}>
  //       {navs.map(item => (
  //         <Link key={item.link} to={item.link}>
  //           {item.label}
  //         </Link>
  //       ))}
  //     </div>
  //     <div className={tw`flex-1 h-full bg-[pink]`}>
  //       <React.Suspense
  //         fallback={
  //           <div className={tw`h-full w-full flex items-center justify-center`}>
  //             <Loading type="points" />
  //           </div>
  //         }
  //       >
  //         <Outlet />
  //       </React.Suspense>
  //     </div>
  //   </div>
  // );
}

export default AppLayout;
