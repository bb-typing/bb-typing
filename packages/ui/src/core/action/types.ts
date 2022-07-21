import type { PlatformName } from '@shared/types/base';
import type { U } from 'ts-toolbelt';

import type { actionConfigModules } from './configs';

export interface ActionConfigOption {
  name: `${PlatformName}:${string}` | (string & {});
  commands: readonly [enCommand: string, zhCommand: string];
  hotkeys?: ReadonlyArray<ActionHotkey>;
  description: string;
  __params_type__?: any;
}

export interface ActionHotkey {
  mac?: string;
  win?: string;
  default?: string;
}

type ActionConfigModules = typeof actionConfigModules[number];

export type ActionConfigNames = ActionConfigModules['config'][number]['name'];

export type ActionConfigScopes = ActionConfigModules['scope'];

//#region  //*=========== action-name-params-map ===========
type _ActionNameParamsMap<
  C extends ActionConfigModules['config'][number] = ActionConfigModules['config'][number],
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
