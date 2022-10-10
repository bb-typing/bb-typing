import type { CommonHotkeyObject } from 'super-hotkey';

import type { ActionConfigName, ActionConfigScope } from '../action';
import type { ActionConfigOption } from '../action/types';

export type HotkeyPlatform = 'win' | 'mac' | 'default';

export type HotkeyContent = CommonHotkeyObject;

export type DefaultHotkeys = ReadonlyArray<
  Partial<Record<HotkeyPlatform, HotkeyContent & { id: string }>>
>;

export interface BaseHotkeyInfo {
  id: string;
  supportedPlatforms: ActionConfigOption['supportedPlatforms'];
  hotkeyContent: HotkeyContent;
  scope: ActionConfigScope;
}

export type BaseHotkeyMap = Partial<
  Record<ActionConfigName | AnyString, Partial<Record<HotkeyPlatform, BaseHotkeyInfo[]>>>
>;

export interface UserHotkeyInfo extends Omit<BaseHotkeyInfo, 'id'> {
  id: string;
  defaultOriginId?: string;
  updateTime: number;
  status: 'enable' | 'disable' | 'delete';
}

export type UserHotkeyMap = Partial<
  Record<ActionConfigName | AnyString, Partial<Record<HotkeyPlatform, UserHotkeyInfo[]>>>
>;

//#region  //*=========== store ===========

export interface HotkeyStoreState {
  defaultHotkeyMap: BaseHotkeyMap;
  userHotkeyMap: UserHotkeyMap;
}

export interface HotkeyStoreAction {
  setUserHotkeyMap: (value: HotkeyStoreState['userHotkeyMap']) => void;
}

export interface HotkeyStoreComputed {
  currentPlatformLatestUsableHotkeyInfoMap: Partial<
    Record<ActionConfigName | AnyString, UserHotkeyInfo | BaseHotkeyInfo>
  >;
}

//#endregion  //*======== store ===========
