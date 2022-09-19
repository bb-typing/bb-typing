import type { CommonHotkeyObject } from 'super-hotkey';

import type { ActionConfigName, ActionConfigScope } from '../action';
import type { ActionConfigOption } from '../action/types';

export type HotkeyPlatform = 'win' | 'mac' | 'default';

export type HotkeyContent = CommonHotkeyObject;

export type DefaultHotkeys = ReadonlyArray<
  Partial<Record<HotkeyPlatform, HotkeyContent>>
>;

export interface HotkeyInfo {
  supportedPlatforms: ActionConfigOption['supportedPlatforms'];
  hotkeyContent: HotkeyContent;
  scope: ActionConfigScope;
  status: 'enable' | 'disable';
}

export type BaseHotkeyMap = Partial<
  Record<ActionConfigName | AnyString, Partial<Record<HotkeyPlatform, HotkeyInfo[]>>>
>;

//#region  //*=========== store ===========

export interface HotkeyStoreState {
  defaultHotkeyMap: BaseHotkeyMap;
  localHotkeyMap: BaseHotkeyMap;
  userHotkeyMap: BaseHotkeyMap;
}

export interface HotkeyStoreActions {}

//#endregion  //*======== store ===========
