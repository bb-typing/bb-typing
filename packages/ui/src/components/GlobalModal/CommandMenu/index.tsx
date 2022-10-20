import type { SpotlightAction } from '@mantine/spotlight';
import { SpotlightProvider } from '@mantine/spotlight';
import type { ActionConfigName } from '@ui/core/action';
import { actionController } from '@ui/core/action';
import { useComputedActionState } from '@ui/core/action/store';
import type { SVGProps } from 'react';
import { useMemo } from 'react';

import MenuItem from './MenuItem';

function TablerSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <circle cx="10" cy="10" r="7"></circle>
        <path d="m21 21l-6-6"></path>
      </g>
    </svg>
  );
}

interface CommandMenuProps {}

function CommandMenu(props: CommandMenuProps): JSX.Element {
  const { usableActions } = useComputedActionState();

  const spotlightActions: SpotlightAction[] = useMemo(() => {
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
  }, [usableActions]);

  return (
    <SpotlightProvider
      actions={spotlightActions}
      searchInputProps={{
        // 加 name 是为了避免与其他「无 name 的 form-input」产生冲突，从而导致「autocomplete」的问题
        name: 'table-search'
      }}
      searchIcon={<TablerSearch fontSize={18} />}
      searchPlaceholder="搜索页面或功能命令..."
      highlightQuery={false}
      actionComponent={MenuItem}
      limit={999}
      shortcut={null}
      nothingFoundMessage="没有找到相关的命令"
    />
  );
}

export default CommandMenu;
