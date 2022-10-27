import { actionHandlersInitializer } from '@ui/core/action';

actionHandlersInitializer();

interface GlobalProviderProps {
  children?: React.ReactNode;
}

function GlobalInitializeProvider(props: GlobalProviderProps): JSX.Element {
  return <>{props.children}</>;
}

export default GlobalInitializeProvider;
