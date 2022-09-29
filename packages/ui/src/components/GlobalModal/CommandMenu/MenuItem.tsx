import {
  Group,
  Highlight,
  Kbd,
  Text,
  UnstyledButton,
  useMantineTheme
} from '@mantine/core';
import type { InnerSpotlightProps } from '@mantine/spotlight/lib/Spotlight/Spotlight';
import { useComputedHotkeyState } from '@ui/core/hotkey';
import useThemeStyle from '@ui/styles/useThemeStyle';
import clsx from 'clsx';
import { tw } from 'twind';

const MenuItem: InnerSpotlightProps['actionComponent'] = props => {
  const { action, onTrigger, hovered, query } = props;
  const { mt, ...appTheme } = useThemeStyle();
  const { currentPlatformLatestHotkeyInfoMap } = useComputedHotkeyState();
  const hotkeyContent = currentPlatformLatestHotkeyInfoMap[action.id!]?.hotkeyContent;

  return (
    <UnstyledButton
      className={clsx(
        tw`relative block w-full px-[12px] py-[10px] rounded-[${
          mt.radius.sm
        }px] hover:(bg-[${appTheme.selector(['dark', 5], ['gray', 0])}])`,
        hovered && tw`bg-[${appTheme.selector(['dark', 4], ['gray', 1])}]`
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
                    {key}
                  </Kbd>
                ));
              }

              return <Kbd className={tw`mr-[4px]`}>{modifierKey}</Kbd>;
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
