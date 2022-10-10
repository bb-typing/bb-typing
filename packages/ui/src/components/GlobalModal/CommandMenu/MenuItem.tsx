import { Group, Highlight, Kbd, Text, UnstyledButton } from '@mantine/core';
import type { InnerSpotlightProps } from '@mantine/spotlight/lib/Spotlight/Spotlight';
import { useComputedHotkeyState } from '@ui/core/hotkey';
import useThemeStyle from '@ui/styles/useThemeStyle';
import { modifierKeyBeautify } from '@ui/utils/keyboard-shortcut';
import clsx from 'clsx';
import { tw } from 'twind';

const MenuItem: InnerSpotlightProps['actionComponent'] = props => {
  const { action, onTrigger, hovered, query } = props;
  const t = useThemeStyle();
  const { currentPlatformLatestUsableHotkeyInfoMap: currentPlatformLatestHotkeyInfoMap } =
    useComputedHotkeyState();
  const hotkeyContent = currentPlatformLatestHotkeyInfoMap[action.id!]?.hotkeyContent;

  return (
    <UnstyledButton
      className={clsx(
        tw`relative block w-full px-[12px] py-[10px] rounded-[${
          t.mt.radius.sm
        }px] hover:(bg-[${t.selector(t.mt.colors.dark[5], t.mt.colors.gray[0])}])`,
        hovered && tw`bg-[${t.selector(t.mt.colors.dark[4], t.mt.colors.gray[1])}]`
      )}
      tabIndex={-1}
      onMouseDown={(event: any) => event.preventDefault()}
      onClick={onTrigger}
    >
      <Group noWrap>
        <div className={tw`flex-1 relative`}>
          <Highlight highlight={query} weight={500}>
            {action.title}
          </Highlight>

          {action.description && (
            <Text color="dimmed" size="xs">
              <Highlight highlight={query} weight={500}>
                {action.description}
              </Highlight>
            </Text>
          )}
          {(() => {
            if (!hotkeyContent) return;
            const { modifierKey, normalKey } = hotkeyContent;
            const modifierKeyJSX: React.ReactNode = (() => {
              if (!modifierKey) return null;

              if (Array.isArray(modifierKey)) {
                return modifierKey.map(key => (
                  <Kbd key={key} className={tw`mr-[4px]`}>
                    {modifierKeyBeautify(key)}
                  </Kbd>
                ));
              }

              return (
                <Kbd className={tw`mr-[4px]`}>{modifierKeyBeautify(modifierKey)}</Kbd>
              );
            })();

            return (
              <div
                className={tw`absolute right-[10px] top-[50%] transform translate-y-[-50%]`}
              >
                {modifierKeyJSX}
                <span className={tw`mx-[3px]`}>+</span>
                <Kbd>{normalKey}</Kbd>
              </div>
            );
          })()}
        </div>
      </Group>
    </UnstyledButton>
  );
};

export default MenuItem;
