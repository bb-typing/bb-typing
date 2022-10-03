import { FunctionSVG } from './svg';

interface MenuItem {
  icon: React.ReactNode;
  text: React.ReactNode;
}

export const menuData: MenuItem[] = [
  {
    icon: <FunctionSVG />,
    text: '功能区'
  }
];
