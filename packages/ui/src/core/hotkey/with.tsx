import type { JSXElementConstructor, ReactElement } from 'react';
import { HotKeys } from 'react-hotkeys';

import type { ActionConfigScope } from '../action';

export function withScopeHotkey<P>(
  scope: ActionConfigScope,
  component: JSXElementConstructor<P>
) {
  return function (props: P) {
    return <HotKeys></HotKeys>;
  };
}

function Test(props: { name: string }) {
  return <div>w cnm</div>;
}

const T = withScopeHotkey('layout', Test);

{
  /* <T />; */
}
