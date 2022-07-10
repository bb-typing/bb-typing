import { tw } from 'twind';
// import { Platform } from '../../libs/platform';
import { Platform } from '@/libs/platform';
import LeftMenuForWeb from './index.web';

function UnifyLeftMenu(): JSX.Element {
  return <div className={tw`w-[150px]`}>我是统一环境下的，宽度只有 150px</div>;
}

const LeftMenu = Platform.isWeb ? LeftMenuForWeb : UnifyLeftMenu;

export default LeftMenu;
