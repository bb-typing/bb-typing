import { tw } from 'twind';

function LeftMenuForWeb(): JSX.Element {
  return <div className={tw`w-[200px]`}>我是 web 环境下的，宽度只有 200px</div>;
}

export default LeftMenuForWeb;
