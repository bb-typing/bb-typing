import type { SpotlightAction } from '@mantine/spotlight';
import { SpotlightProvider } from '@mantine/spotlight';
import { useTrackedActionStore } from '@ui/core/action';
import { filterUsableActionsByActiveScope } from '@ui/core/action/utils';
import { useMemo } from 'react';
import './action-handler';

import { TablerSearch } from './svg';

interface CommandMenuProps {}

function CommandMenu(props: CommandMenuProps): JSX.Element {
  const { activeScopes } = useTrackedActionStore();

  const spotlightActions: SpotlightAction[] = useMemo(() => {
    const usableActions = filterUsableActionsByActiveScope(activeScopes, {
      ignoreActionNames: ['open-search-modal']
    });

    return usableActions.map(
      action =>
        ({
          description: action.description,
          // TODO: 暂时采用中文的文案
          title: action.commands[1]
        } as SpotlightAction)
    );
  }, [activeScopes]);

  return (
    <SpotlightProvider
      actions={spotlightActions}
      searchIcon={<TablerSearch fontSize={18} />}
      searchPlaceholder="Search..."
      shortcut={null}
      nothingFoundMessage="Nothing found..."
    ></SpotlightProvider>
  );
}

export default CommandMenu;
