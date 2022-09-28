import { useMantineTheme } from '@mantine/core';

function useStyle() {
  const theme = useMantineTheme();
  const isDark = theme.colorScheme === 'dark';
}

export default useStyle;
