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

export interface UserHotkeyInfo extends Omit<BaseHotkeyInfo, 'hotkeyContent'> {
  defaultOriginId?: string;
  updateTime: number;
  hotkeyContent: HotkeyContent | null;
}

export type UserHotkeyMap = Partial<
  Record<ActionConfigName | AnyString, Partial<Record<HotkeyPlatform, UserHotkeyInfo[]>>>
>;

//#region  //*=========== store ===========

export interface HotkeyStoreState {
  activeHotkeyType: 'user' | 'local';
  defaultHotkeyMap: BaseHotkeyMap;
  userHotkeyMap: UserHotkeyMap;
  localHotkeyMap: UserHotkeyMap;
}

export interface HotkeyStoreActions {
  setUserHotkeyMap: (value: HotkeyStoreState['userHotkeyMap']) => void;
  setActiveHotkeyType(value: HotkeyStoreState['activeHotkeyType']): void;
  switchActiveHotkeyType(): void;
  syncHotkeyMap(
    source: HotkeyStoreState['activeHotkeyType'],
    target: HotkeyStoreState['activeHotkeyType'],
    mode: 'pure' | 'merge'
  ): void;
  updateActiveHotkey: (
    actionName: ActionConfigName | AnyString,
    operation: (
      | {
          type: 'add' | 'update';
          hotkeyContent: HotkeyContent;
        }
      | {
          type: 'delete';
        }
    ) & {
      defaultOriginId?: string;
      hotkeyPlatform: HotkeyPlatform;
    } & (
        | {
            hotkeyType: 'user';
            hotkeyInfo: UserHotkeyInfo;
          }
        | {
            hotkeyType: 'default';
            hotkeyInfo: BaseHotkeyInfo;
          }
      )
  ) => void;
}

export interface HotkeyStoreComputedVal {
  currentPlatformLatestUsableHotkeyInfoMap: Partial<
    Record<ActionConfigName | AnyString, UserHotkeyInfo | BaseHotkeyInfo>
  >;
  currentActiveHotkeyMap:
    | HotkeyStoreState['userHotkeyMap']
    | HotkeyStoreState['localHotkeyMap'];
}

//#endregion  //*======== store ===========
