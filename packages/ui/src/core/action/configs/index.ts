import { globalActionConfigs } from './global';
import { layoutActionConfigs } from './layout';

export const actionConfigModules = [globalActionConfigs, layoutActionConfigs] as const;
