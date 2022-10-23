import type { History } from 'history';
import React from 'react';
import type { RouterProps } from 'react-router-dom';
import { Router } from 'react-router-dom';

function CustomRouter({
  children,
  history
}: Partial<RouterProps> & { history: History }) {
  const [state, setState] = React.useState({
    action: history.action,
    location: history.location
  });

  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
      /* basename="/ui" */
    />
  );
}

export default CustomRouter;
