import logo from '@ui/assets/images/logo.png';
import { tw } from 'twind';

import { menuData } from './core/menu-data';

function AppLayoutSidebar(): JSX.Element {
  return (
    <div className={tw`w-[250px] flex(& col) items-center box-border py-[10px]`}>
      <img src={logo} className={tw`w-[50px] my-[15px] cursor-pointer hover:(scale-125)`} />

      {renderMenu()}
    </div>
  );

  function renderMenu(): JSX.Element {
    return (
      <div>
        {menuData.map(menu => {
          return <div></div>;
        })}
      </div>
    );
  }
}

export default AppLayoutSidebar;
