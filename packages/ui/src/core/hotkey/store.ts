import _ from 'lodash';
import { nanoid } from 'nanoid';
import { createTrackedSelector } from 'react-tracked';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type {
  HotkeyStoreActions,
  HotkeyStoreComputedVal,
  HotkeyStoreState,
  UserHotkeyInfo
} from './types';
import {
  defaultHotkeysInitializer,
  filterHotkeyMapByPlatform,
  filterHotkeyPlatform
} from './utils';

type Store = HotkeyStoreState & HotkeyStoreActions;

export const useHotkeyStore = create<
  Store,
  [['zustand/persist', Partial<HotkeyStoreState>], ['zustand/immer', HotkeyStoreState]]
>(
  persist(
    immer(set => ({
      //#region  //*=========== state ===========
      activeHotkeyType: 'local',
      defaultHotkeyMap: defaultHotkeysInitializer(),
      userHotkeyMap: {},
      localHotkeyMap: {},
      //#endregion  //*======== state ===========
      //#region  //*=========== action ===========
      switchActiveHotkeyType: () =>
        set(state => {
          const isLocale = state.activeHotkeyType === 'local';

          state.activeHotkeyType = isLocale ? 'user' : 'local';
        }),
      setActiveHotkeyType: newActiveHotkeyType =>
        set(state => {
          state.activeHotkeyType = newActiveHotkeyType;
        }),

      syncHotkeyMap: (source, target, mode) =>
        set(state => {
          const sourceMap =
            source === 'user' ? state.userHotkeyMap : state.localHotkeyMap;

          if (mode === 'merge') {
            // ...
          } else {
            state[target === 'user' ? 'userHotkeyMap' : 'localHotkeyMap'] = sourceMap;
          }
        }),

      setUserHotkeyMap: userHotkeyMap =>
        set(state => {
          state.userHotkeyMap = userHotkeyMap;
        }),
      updateActiveHotkey: (actionName, operation) =>
        set((state: HotkeyStoreState) => {
          const updateTime = Date.now();
          const { supportedPlatforms, scope } = operation.hotkeyInfo;
          const currentActiveHotkey =
            state.activeHotkeyType === 'local'
              ? state.localHotkeyMap
              : state.userHotkeyMap;

          _.set(
            currentActiveHotkey,
            [actionName, operation.hotkeyPlatform],
            currentActiveHotkey[actionName]?.[operation.hotkeyPlatform] || []
          );

          const updateHotkeyOrigins =
            currentActiveHotkey[actionName]![operation.hotkeyPlatform]!;

          switch (operation.type) {
            case 'add': {
              updateHotkeyOrigins.push({
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
                updateHotkeyOrigins.forEach(userHotkeyInfo => {
                  if (userHotkeyInfo.id === operation.hotkeyInfo.id) {
                    userHotkeyInfo.updateTime = updateTime;
                    userHotkeyInfo.hotkeyContent = operation.hotkeyContent;
                  }
                });
              } else {
                updateHotkeyOrigins.push({
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
                for (let index = updateHotkeyOrigins.length - 1; index >= 0; index--) {
                  const fromDefault = !!updateHotkeyOrigins[index].defaultOriginId;
                  const equalId =
                    updateHotkeyOrigins[index].id === operation.hotkeyInfo.id;
                  const equalDefaultOriginId =
                    updateHotkeyOrigins[index].defaultOriginId ===
                    operation.defaultOriginId;

                  if (equalId) {
                    if (fromDefault && equalDefaultOriginId) {
                      updateHotkeyOrigins[index] = {
                        ...updateHotkeyOrigins[index],
                        hotkeyContent: null,
                        updateTime
                      };
                    } else {
                      updateHotkeyOrigins.splice(index, 1);
                    }
                  }
                }
              } else {
                updateHotkeyOrigins.push({
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
      partialize: state => ({
        activeHotkeyType: state.activeHotkeyType,
        userHotkey: state.userHotkeyMap,
        localHotkey: state.localHotkeyMap
      })
    }
  )
);

export const useTrackedHotkeyState =
  createTrackedSelector<HotkeyStoreState>(useHotkeyStore);

export const useComputedHotkeyState = (): HotkeyStoreComputedVal => {
  const getState = useTrackedHotkeyState;

  return {
    get currentPlatformLatestUsableHotkeyInfoMap() {
      const result: HotkeyStoreComputedVal['currentPlatformLatestUsableHotkeyInfoMap'] =
        {};

      const { defaultHotkeyMap: defaultHotkeyMap, userHotkeyMap: userHotkeyMap } =
        getState();
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
    },
    get currentActiveHotkeyMap() {
      const {
        activeHotkeyType,
        userHotkeyMap: userHotkeyMap,
        localHotkeyMap: localHotkeyMap
      } = getState();

      return activeHotkeyType === 'local' ? localHotkeyMap : userHotkeyMap;
    }
  };
};

export const useHotkeyActions = (): HotkeyStoreActions => {
  return useHotkeyStore.getState();
};
