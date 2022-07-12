import { Route, Routes } from 'react-router-dom';
import ViewShortcutKey from './view/ShortcutKey';

export const SettingRoutes = () => {
  return (
    <Routes>
      <Route path="shortcut-key" element={<ViewShortcutKey />} />
    </Routes>
  );
};
