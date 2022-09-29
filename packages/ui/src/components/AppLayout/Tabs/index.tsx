import useThemeStyle from '@ui/styles/useThemeStyle';
import { tw } from 'twind';

function AppLayoutTabs(): JSX.Element {
  const appThemeStyle = useThemeStyle();

  return (
    <div
      className={tw`w-full h-[50px] mb-[5px] bg-[${appThemeStyle.background[0]}] text-[${appThemeStyle.text[0]}]`}
    >
      我是选项卡
    </div>
  );
}

export default AppLayoutTabs;
