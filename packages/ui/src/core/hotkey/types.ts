import type { CommonHotkeyObject } from 'super-hotkey';

import type { ActionConfigName, ActionConfigScope } from '../action';
import type { ActionConfigOption } from '../action/types';

export type HotkeyPlatform = 'win' | 'mac' | 'default';

export type HotkeyContent = CommonHotkeyObject;

export type DefaultHotkeys = ReadonlyArray<
  Partial<Record<HotkeyPlatform, HotkeyContent>>
>;

export interface BaseHotkeyInfo {
  supportedPlatforms: ActionConfigOption['supportedPlatforms'];
  hotkeyContent: HotkeyContent;
  scope: ActionConfigScope;
  status: 'enable' | 'disable';
}

export type BaseHotkeyMap = Partial<
  Record<ActionConfigName | AnyString, Partial<Record<HotkeyPlatform, BaseHotkeyInfo[]>>>
>;

export interface UserHotkeyInfo extends BaseHotkeyInfo {
  id: string;
  updateTime: number;
  isDefaultOrigin: boolean;
}

type UserHotkeyMap = Partial<
  Record<ActionConfigName | AnyString, Partial<Record<HotkeyPlatform, UserHotkeyInfo[]>>>
>;

//#region  //*=========== store ===========

export interface HotkeyStoreState {
  defaultHotkeyMap: BaseHotkeyMap;
  userHotkeyMap: UserHotkeyMap;
}

export interface HotkeyStoreActions {
  setUserHotkeyMap: (value: HotkeyStoreState['userHotkeyMap']) => void;
}

export interface HotkeyStoreComputed {
  currentPlatformLatestHotkeyInfoMap: Partial<
    Record<ActionConfigName | AnyString, UserHotkeyInfo | BaseHotkeyInfo>
  >;
}

//#endregion  //*======== store ===========
