import { RouterWrapper } from './Router';
import { Inspector } from 'react-dev-inspector';

export function App() {
  return (
    <>
      <RouterWrapper />
      {import.meta.env.DEV && <Inspector />}
    </>
  );
}
