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
}

export default AppLayout;
