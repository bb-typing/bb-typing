import type { PlatformName } from '@shared/types/base';
import type { U } from 'ts-toolbelt';

import type { actionConfigModules } from './configs';
import type { DefaultHotkeys } from '../hotkey';

export interface ActionConfigOption {
  name: `${PlatformName}:${string}` | (string & {});
  supportedPlatforms: PlatformName[];
  commands: [enCommand: string, zhCommand: string];
  defaultHotkeys?: DefaultHotkeys;
  description: string;
  __params_type__?: any;
}

export interface ActionHotkey {
  mac?: string;
  win?: string;
  default?: string;
}

type ActionConfigModules = typeof actionConfigModules[number];

export type ActionConfigName = ActionConfigModules['configs'][number]['name'];

export type ActionConfigScope = ActionConfigModules['scope'];

//#region  //*=========== action-name-params-map ===========
type _ActionNameParamsMap<
  C extends ActionConfigModules['configs'][number] = ActionConfigModules['configs'][number],
  B extends C = C
> = U.Merge<
  B extends C
    ? {
        /** __params_type__ 的类型为 unknown 时，actionController.emit 调用时，无需传第二个 params */
        [K in B['name']]: B['__params_type__'];
      }
    : never
>;

export type ActionNameParamsMap = _ActionNameParamsMap;
//#endregion  //*======== action-name-params-map ===========

//#region  //*=========== store ===========
export interface ActionStoreState {
  activeScopes: ActionConfigScope[];
}

export interface ActionStoreActions {
  addActiveScope: (scope: ActionConfigScope) => void;
  delActiveScope: (scope: ActionConfigScope) => void;
}

//#endregion  //*======== store ===========
