import { Button, useMantineColorScheme } from '@mantine/core';
import React from 'react';
import { tw } from 'twind';

import useStyle from './style';

interface ViewShortcutKeyProps {}

const ViewKeyboardShortcut: React.FC<ViewShortcutKeyProps> = props => {
  const style = useStyle();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <div className={tw`w-full h-full`}>
      <Button
        onClick={() => {
          toggleColorScheme();
        }}
      >
        切换主题色
      </Button>
    </div>
  );
};

export default ViewKeyboardShortcut;
