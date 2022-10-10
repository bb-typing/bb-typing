import { withScopeHotkey } from '@ui/core/hotkey';
import { tw } from 'twind';

import AppLayoutContent from './Content';
import AppLayoutSidebar from './Sidebar';

function AppLayout(): JSX.Element {
  return (
    <div className={tw(`h-screen w-screen flex`)}>
      <AppLayoutSidebar />
      {/* #region  //*=========== Right =========== */}
      <div className={tw`flex(& 1 col)`}>
        <AppLayoutContent />
      </div>
      {/* #endregion  //*======== Right =========== */}
    </div>
  );
}

export default withScopeHotkey('layout', AppLayout);
