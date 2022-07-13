import { Route, Routes } from 'react-router-dom';
import ViewShortcutKey from './view/ShortcutKey';

function SettingRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="shortcut-key" element={<ViewShortcutKey />} />
    </Routes>
  );
}

export default SettingRoutes;
