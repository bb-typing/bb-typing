import useThemeStyle from '@ui/styles/useThemeStyle';
import { tw } from 'twind';

function AppLayoutTabs(): JSX.Element {
  const t = useThemeStyle();

  return (
    <div
      className={tw`w-full h-[50px] mb-[5px] bg-[${t.selector(
        '#1a1b1e',
        '#fff'
      )}] text-[${t.selector('#fff', '#000')}]`}
    >
      我是选项卡
    </div>
  );
}

export default AppLayoutTabs;
