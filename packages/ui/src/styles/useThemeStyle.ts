import { useMantineTheme } from '@mantine/core';
import { useComputedThemeState } from '@ui/stores/theme';

function useThemeStyle() {
  const { isDark } = useComputedThemeState();
  const mt = useMantineTheme();

  // type ColorKey = keyof MantineThemeColors;
  // type ColorLevel = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9][number];
  const selector = (darkStyle: string, lightStyle: string): string => {
    return isDark ? darkStyle : lightStyle;
  };

  return {
    mt,
    selector,
    isDark
  };
}

export default useThemeStyle;
