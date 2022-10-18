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
                  supportedPlatforms,
                  scope,
                  updateTime
                });
              }

              break;
            }

            case 'delete': {
              if (operation.hotkeyType === 'user') {
                for (let index = userHotkeyOrigins.length - 1; index >= 0; index--) {
                  const fromDefault = !!userHotkeyOrigins[index].defaultOriginId;
                  const equalId = userHotkeyOrigins[index].id === operation.hotkeyInfo.id;
                  const equalDefaultOriginId =
                    userHotkeyOrigins[index].defaultOriginId ===
                    operation.defaultOriginId;

                  if (equalId) {
                    if (fromDefault && equalDefaultOriginId) {
                      userHotkeyOrigins[index] = {
                        ...userHotkeyOrigins[index],
                        hotkeyContent: null,
                        updateTime
                      };
                    } else {
                      userHotkeyOrigins.splice(index, 1);
                    }
                  }
                }
              } else {
                userHotkeyOrigins.push({
                  hotkeyContent: null,
                  defaultOriginId: operation.defaultOriginId,
                  id: nanoid(),
                  supportedPlatforms,
                  scope,
                  updateTime
                });
              }

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
            const [userHighestPriorityHotkeyInfo] = userDefinedHotkeyInfos
              .filter(
                item => item.hotkeyContent?.modifierKey || item.hotkeyContent?.normalKey
              )
              .sort((a, b) => a.updateTime - b.updateTime) as [
              UserHotkeyInfo | undefined
            ];

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
