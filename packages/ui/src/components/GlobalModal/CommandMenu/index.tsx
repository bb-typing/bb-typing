import type { SpotlightAction } from '@mantine/spotlight';
import { SpotlightProvider } from '@mantine/spotlight';
import type { ActionConfigName } from '@ui/core/action';
import { actionController, useTrackedActionStore } from '@ui/core/action';
import { filterUsableActionsByActiveScope } from '@ui/core/action/utils';
import { useMemo } from 'react';
import './action-handler';

import MenuItem from './MenuItem';
import { TablerSearch } from './svg';

interface CommandMenuProps {}

function CommandMenu(props: CommandMenuProps): JSX.Element {
  const { activeScopes } = useTrackedActionStore();

  const spotlightActions: SpotlightAction[] = useMemo(() => {
    const usableActions = filterUsableActionsByActiveScope(activeScopes, {
      ignoreActionNames: ['system:open-search-modal']
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

  return (
    <SpotlightProvider
      actions={spotlightActions}
      searchIcon={<TablerSearch fontSize={18} />}
      searchPlaceholder="搜索页面或功能命令..."
      highlightQuery={false}
      actionComponent={MenuItem}
      // actionsWrapperComponent={({ children }) => {
      //   return <div className={tw``}>{children}</div>;
      // }}
      limit={999}
      shortcut={null}
      nothingFoundMessage="没有找到相关的命令"
    />
  );
}

export default CommandMenu;
