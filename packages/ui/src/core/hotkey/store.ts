import _ from 'lodash';
import { nanoid } from 'nanoid';
import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type {
  HotkeyStoreAction,
  HotkeyStoreComputed,
  HotkeyStoreState,
  UserHotkeyInfo
} from './types';
import {
  defaultHotkeysInitializer,
  filterHotkeyMapByPlatform,
  filterHotkeyPlatform
} from './utils';
import { actionController } from '../action';

type Store = HotkeyStoreState & HotkeyStoreAction;

export const useHotkeyStore = create<
  Store,
  [['zustand/persist', Partial<HotkeyStoreState>], ['zustand/immer', HotkeyStoreState]]
>(
  persist(
    immer(set => ({
      //#region  //*=========== state ===========
      defaultHotkeyMap: defaultHotkeysInitializer(),
      userHotkeyMap: {},
      //#endregion  //*======== state ===========
      //#region  //*=========== action ===========

      setUserHotkeyMap: userHotkeyMap =>
        set(state => {
          state.userHotkeyMap = userHotkeyMap;
        }),
      updateUserHotkeyMap: (actionName, operation) =>
        set((state: HotkeyStoreState) => {
          const updateTime = Date.now();
          const { supportedPlatforms, scope } = operation.hotkeyInfo;

          _.set(
            state.userHotkeyMap,
            [actionName, operation.hotkeyPlatform],
            state.userHotkeyMap[actionName]?.[operation.hotkeyPlatform] || []
          );

          const userHotkeyOrigins =
            state.userHotkeyMap[actionName]![operation.hotkeyPlatform]!;

          switch (operation.type) {
            case 'add': {
              userHotkeyOrigins.push({
                hotkeyContent: operation.hotkeyContent,
                id: nanoid(),
                status: 'enable',
                supportedPlatforms,
                scope,
                updateTime
              });

              break;
            }

            case 'update': {
              if (operation.hotkeyType === 'user') {
                userHotkeyOrigins.forEach(userHotkeyInfo => {
                  if (userHotkeyInfo.id === operation.hotkeyInfo.id) {
                    userHotkeyInfo.updateTime = updateTime;
                    userHotkeyInfo.hotkeyContent = operation.hotkeyContent;
                  }
                });
              } else {
                userHotkeyOrigins.push({
                  hotkeyContent: operation.hotkeyContent,
                  defaultOriginId: operation.defaultOriginId,
                  id: nanoid(),
                  status: 'enable',
                  supportedPlatforms,
                  scope,
                  updateTime
                });
              }

              break;
            }

            case 'disable': {
              if (operation.hotkeyType === 'user') {
                userHotkeyOrigins.forEach(userHotkeyInfo => {
                  if (userHotkeyInfo.id === operation.hotkeyInfo.id) {
                    userHotkeyInfo.updateTime = updateTime;
                    userHotkeyInfo.status = 'disable';
                  }
                });
              }

              break;
            }

            case 'delete': {
              if (operation.hotkeyType === 'user') {
                _.remove(
                  userHotkeyOrigins,
                  userHotkeyInfo => userHotkeyInfo.id === operation.hotkeyInfo.id
                );
              } else {
                userHotkeyOrigins.push({
                  defaultOriginId: operation.defaultOriginId,
                  hotkeyContent: operation.hotkeyInfo.hotkeyContent,
                  id: nanoid(),
                  status: 'delete',
                  supportedPlatforms,
                  scope,
                  updateTime
                });
              }

              break;
            }

            case 'enable': {
              userHotkeyOrigins.forEach(userHotkeyInfo => {
                if (operation.hotkeyType === 'user') {
                  if (userHotkeyInfo.id === operation.hotkeyInfo.id) {
                    userHotkeyInfo.updateTime = updateTime;
                    userHotkeyInfo.status = 'enable';
                  }
                }
              });

              break;
            }
          }
        })

      //#endregion  //*======== action ===========
    })),
    {
      name: 'bb-store-hotkey',
      partialize: state => ({ userHotkeyMap: state.userHotkeyMap })
    }
  )
);

export const useTrackedHotkeyState =
  createTrackedSelector<HotkeyStoreState>(useHotkeyStore);

export const useComputedHotkeyState = (): HotkeyStoreComputed => {
  const getState = useTrackedHotkeyState;

  return {
    get currentPlatformLatestUsableHotkeyInfoMap() {
      const result: HotkeyStoreComputed['currentPlatformLatestUsableHotkeyInfoMap'] = {};

      const { defaultHotkeyMap, userHotkeyMap } = getState();
      const currentHotkeyPlatform = filterHotkeyPlatform();

      const defaultPlatformHotkeyMap = filterHotkeyMapByPlatform(
        defaultHotkeyMap,
        currentHotkeyPlatform
      );

      Object.entries(defaultPlatformHotkeyMap).forEach(
        ([actionName, defaultHotkeyInfos]) => {
          const userDefinedHotkeyInfos =
            userHotkeyMap?.[actionName]?.[currentHotkeyPlatform!];
          const defaultHotkeyInfo = defaultHotkeyInfos?.at(-1);

          if (userDefinedHotkeyInfos) {
            const userHighestPriorityHotkeyInfo = userDefinedHotkeyInfos
              .sort((a, b) => a.updateTime - b.updateTime)
              .find(hotkeyInfo => hotkeyInfo.status === 'enable');

            result[actionName] = (userHighestPriorityHotkeyInfo ||
              defaultHotkeyInfo) as any;
          } else {
            result[actionName] = defaultHotkeyInfo as any;
          }

          if (result[actionName] === undefined) {
            delete result[actionName];
          }
        }
      );

      return result;
    }
  };
};
