import { Menu } from '@mantine/core';
import logo from '@ui/assets/images/logo.png';
import { useTrackedAppLayoutStore } from '@ui/stores/app-layout';
import React from 'react';
import { tw } from 'twind';

import { menuData } from './menu-data';
import {
  IcRoundFormatIndentDecrease,
  IcSharpFormatIndentIncrease,
  MaterialSymbolsSwipeLeftSharp
} from './svg';

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
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <span className={style}>{switchIconMap[sidebarFoldStatus]}</span>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item>仅图标（默认）</Menu.Item>
          <Menu.Item>图标与文字</Menu.Item>
          <Menu.Item>隐藏</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  }

  function renderUnfold(): JSX.Element {
    return <span></span>;
  }
}

export default AppLayoutSidebar;
