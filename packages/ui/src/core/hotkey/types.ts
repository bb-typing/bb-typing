import type { ActionConfigName, ActionConfigScope } from '../action';
import type { ActionConfigOption } from '../action/types';

export type HotkeyPlatform = 'win' | 'mac' | 'default';

type HotkeyContent = string;

export type DefaultHotkeys = ReadonlyArray<
  Partial<Record<HotkeyPlatform, HotkeyContent>>
>;

//#region  //*=========== store ===========

export interface HotkeyInfo {
  supportedPlatforms: ActionConfigOption['supportedPlatforms'];
  hotkeyContent: HotkeyContent;
  scope: ActionConfigScope;
  status: 'enable' | 'disable';
}

export type BaseHotkeyMap = Partial<
  Record<ActionConfigName | AnyString, Partial<Record<HotkeyPlatform, HotkeyInfo[]>>>
>;

export interface HotkeyStoreState {
  defaultHotkeyMap: BaseHotkeyMap;
  localHotkeyMap: BaseHotkeyMap;
  userHotkeyMap: BaseHotkeyMap;
}

export interface HotkeyStoreActions {}

//#endregion  //*======== store ===========
