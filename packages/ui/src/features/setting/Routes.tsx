import { Route, Routes } from 'react-router-dom';

import ViewKeyboardShortcut from './view/KeyboardShortcut';

function SettingRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="keyboard-shortcut" element={<ViewKeyboardShortcut />} />
    </Routes>
  );
}

export default SettingRoutes;
