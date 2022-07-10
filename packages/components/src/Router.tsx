import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layout';

import Test1 from './containers/test-1';

export function RouterWrapper(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="test1" element={<Test1 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
