import { useMantineTheme } from '@mantine/core';
import { useComputedThemeState } from '@ui/stores/theme';

function useThemeStyle() {
  const { isDark } = useComputedThemeState();
  const mantineTheme = useMantineTheme();

  const text: string[] = [
    isDark ? mantineTheme.colors.dark[0] : mantineTheme.colors.gray[7]
  ];

  const background: string[] = [
    isDark ? mantineTheme.colors.dark[7] : mantineTheme.colors.gray[0]
  ];

  return {
    text,
    background
  };
}

export default useThemeStyle;
