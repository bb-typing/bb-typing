import { clsx, Group, Text, UnstyledButton, useMantineTheme } from '@mantine/core';
import type { SpotlightAction } from '@mantine/spotlight';
import { SpotlightProvider } from '@mantine/spotlight';
import type { InnerSpotlightProps } from '@mantine/spotlight/lib/Spotlight/Spotlight';
import type { ActionConfigName } from '@ui/core/action';
import { actionController, useTrackedActionStore } from '@ui/core/action';
import { filterUsableActionsByActiveScope } from '@ui/core/action/utils';
import { useMemo } from 'react';
import { tw } from 'twind';
import './action-handler';

import { TablerSearch } from './svg';

interface CommandMenuProps {}

function CommandMenu(props: CommandMenuProps): JSX.Element {
  const { activeScopes } = useTrackedActionStore();
  const theme = useMantineTheme();

  const spotlightActions: SpotlightAction[] = useMemo(() => {
    const usableActions = filterUsableActionsByActiveScope(activeScopes, {
      ignoreActionNames: ['open-search-modal']
    });

    return usableActions.map(
      action =>
        ({
          description: action.description,
          // TODO: 暂时采用中文的文案
          title: action.commands[1],
          id: action.name,
          onTrigger(action) {
            actionController.emit(action.id as ActionConfigName);
          }
        } as SpotlightAction)
    );
  }, [activeScopes]);

  const ActionComponent: InnerSpotlightProps['actionComponent'] = props => {
    const { action, onTrigger, hovered, query, ...others } = props;

    return (
      <UnstyledButton
        className={clsx(
          tw`relative block w-full px-[12px] py-[10px] rounded-[${theme.radius.sm}]`,
          hovered &&
            tw`bg-[${
              theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1]
            }]`
        )}
        tabIndex={-1}
        onMouseDown={(event: any) => event.preventDefault()}
        onClick={onTrigger}
        {...others}
      >
        <Group noWrap>
          <div className={tw`flex-1`}>
            <Text>{action.title}</Text>

            {action.description && (
              <Text color="dimmed" size="xs">
                {action.description}
              </Text>
            )}
          </div>
        </Group>
      </UnstyledButton>
    );
  };

  return (
    <SpotlightProvider
      actions={spotlightActions}
      searchIcon={<TablerSearch fontSize={18} />}
      searchPlaceholder="搜索页面或功能命令..."
      actionComponent={ActionComponent}
      actionsWrapperComponent={({ children }) => {
        return <div className={tw``}>{children}</div>;
      }}
      limit={999}
      shortcut={null}
      nothingFoundMessage="没有找到相关的命令"
    ></SpotlightProvider>
  );
}

export default CommandMenu;
