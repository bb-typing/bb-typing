import type { MantineThemeColors } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import { useComputedThemeState } from '@ui/stores/theme';

function useThemeStyle() {
  const { isDark } = useComputedThemeState();
  const mt = useMantineTheme();

  const text: string[] = [isDark ? mt.colors.dark[0] : mt.colors.gray[7]];

  const background: string[] = [isDark ? mt.colors.dark[7] : mt.colors.gray[0]];

  type ColorKey = keyof MantineThemeColors;
  type ColorLevel = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9][number];
  const selector = (
    darkColor: [ColorKey, ColorLevel],
    lightColor: [ColorKey, ColorLevel]
  ): string => {
    const [color, level] = isDark ? darkColor : lightColor;

    return mt.colors[color][level];
  };

  return {
    mt,
    text,
    background,
    selector
  };
}

export default useThemeStyle;
