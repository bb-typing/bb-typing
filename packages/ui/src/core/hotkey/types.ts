import type { ActionConfigName, ActionConfigScope } from '../action';

export type HotkeyPlatform = 'win' | 'mac' | 'default';

type HotkeyContent = string;

export type DefaultHotkeys = ReadonlyArray<Partial<Record<HotkeyPlatform, HotkeyContent>>>;

//#region  //*=========== store ===========

export interface HotkeyInfo {
  hotkeyContent: HotkeyContent;
  scope: ActionConfigScope;
  status: 'enable' | 'disable';
}

type BaseHotkeyMap = Partial<Record<ActionConfigName, Partial<Record<HotkeyPlatform, HotkeyInfo[]>>>>;

export interface HotkeyStoreState {
  defaultHotkeyMap: BaseHotkeyMap;
  localHotkeyMap: BaseHotkeyMap;
  userHotkeyMap: BaseHotkeyMap;
}

export interface HotkeyStoreActions {}

//#endregion  //*======== store ===========
