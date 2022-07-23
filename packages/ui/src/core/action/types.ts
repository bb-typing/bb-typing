import type { PlatformName } from '@shared/types/base';
import type { U } from 'ts-toolbelt';

import type { actionConfigModules } from './configs';
import type { DefaultHotkeys } from '../hotkey';

export interface ActionConfigOption {
  name: `${PlatformName}:${string}` | (string & {});
  commands: readonly [enCommand: string, zhCommand: string];
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
}

//#endregion  //*======== store ===========
