import { Button, Tooltip } from '@nextui-org/react';
import { Platform } from '@ui/libs/platform';
import { tw } from 'twind';
import { useContext } from './context';
import LeftMenuForWeb from './index.web';

function UnifyLeftMenu(): JSX.Element {
  const { updateFoldingStatus, useStoreState } = useContext();
  const { foldingStatus } = useStoreState();

  const menuWidthMap: Record<typeof foldingStatus, number> = {
    'icon-text': 250,
    icon: 60,
    none: 0
  };

  return (
    <div className={tw`w-[${menuWidthMap[foldingStatus]}px]`}>
      <Tooltip
        content={
          <>
            <Button
              color="gradient"
              css={{ mb: 3 }}
              onClick={() => {
                updateFoldingStatus('none');
              }}
            >
              隐藏
            </Button>
            <Button
              color="gradient"
              css={{ mb: 4 }}
              onClick={() => {
                updateFoldingStatus('icon');
              }}
            >
              仅 Icon
            </Button>
            <Button
              color="gradient"
              css={{ mb: 4 }}
              onClick={() => {
                updateFoldingStatus('icon-text');
              }}
            >
              Icon 与文案
            </Button>
          </>
        }
        rounded
        color="primary"
        placement="bottomEnd"
      >
        <Button auto flat>
          改变折叠状态
        </Button>
      </Tooltip>
    </div>
  );
}

const LeftMenu = Platform.isWeb ? LeftMenuForWeb : UnifyLeftMenu;

export default LeftMenu;
