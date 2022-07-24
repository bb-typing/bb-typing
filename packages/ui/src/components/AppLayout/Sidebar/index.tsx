import { Dropdown } from '@nextui-org/react';
import logo from '@ui/assets/images/logo.png';
import { useTrackedAppLayoutStore } from '@ui/stores/app-layout';
import React from 'react';
import { tw } from 'twind';

import { menuData } from './core/menu-data';
import {
  IcRoundFormatIndentDecrease,
  IcSharpFormatIndentIncrease,
  MaterialSymbolsSwipeLeftSharp
} from './core/svg';

function AppLayoutSidebar(): JSX.Element {
  const { sidebarFoldStatus, setSidebarFoldStatus } = useTrackedAppLayoutStore();

  const foldWidthMap: Record<typeof sidebarFoldStatus, number> = {
    'icon-text': 250,
    hide: 0,
    icon: 100
  };

  return (
    <div
      className={tw`w-[${foldWidthMap[sidebarFoldStatus]}px] h-full flex(& col) items-center box-border py-[10px] relative`}
    >
      <img
        src={logo}
        className={tw`w-[50px] my-[15px] cursor-pointer hover:(scale-125)`}
      />
      {renderMenu()}
      {renderSwitchFold()}
    </div>
  );

  function renderMenu(): JSX.Element {
    return (
      <div>
        {menuData.map((menu, index) => {
          return <div key={index}></div>;
        })}
      </div>
    );
  }

  function renderSwitchFold(): JSX.Element {
    const switchIconMap: Record<typeof sidebarFoldStatus, React.ReactNode> = {
      icon: <IcRoundFormatIndentDecrease />,
      'icon-text': <IcSharpFormatIndentIncrease />,
      hide: <MaterialSymbolsSwipeLeftSharp />
    };

    const style = tw`absolute right-[10px] bottom-[20px] cursor-pointer text([22px] hover:[#3498db])`;

    return (
      <Dropdown>
        <Dropdown.Trigger>
          <span className={style}>{switchIconMap[sidebarFoldStatus]}</span>
        </Dropdown.Trigger>
        <Dropdown.Menu
          onAction={key => {
            setSidebarFoldStatus(key as typeof sidebarFoldStatus);
          }}
        >
          <Dropdown.Item key="icon">仅图标（默认）</Dropdown.Item>
          <Dropdown.Item key="icon-text">图标与文字</Dropdown.Item>
          <Dropdown.Item key="hide" withDivider color="error">
            隐藏
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  function renderUnfold(): JSX.Element {
    return <span></span>;
  }
}

export default AppLayoutSidebar;
