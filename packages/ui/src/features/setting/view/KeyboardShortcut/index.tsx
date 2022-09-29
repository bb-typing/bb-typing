import { Button } from '@mantine/core';
import React, { memo } from 'react';
import { tw } from 'twind';

interface ViewShortcutKeyProps {}

const ViewKeyboardShortcut: React.FC<ViewShortcutKeyProps> = props => {
  return (
    <div className={tw`w-full h-full`}>
      <Button onClick={() => {}}>切换主题色</Button>
    </div>
  );
};

export default memo(ViewKeyboardShortcut);
