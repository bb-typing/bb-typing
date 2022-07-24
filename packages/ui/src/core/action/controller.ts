import type { Equal } from '@type-challenges/utils';
import mitt from 'mitt';

import { actionConfigModules } from './configs';
import type { ActionConfigName, ActionNameParamsMap } from './types';

export class ActionController {
  private eventBus = mitt<ActionNameParamsMap>();
  private actions = actionConfigModules;

  public getActions() {
    return this.actions;
  }

  public emit<
    Name extends ActionConfigName,
    Params extends ActionNameParamsMap[Name] = ActionNameParamsMap[Name]
  >(
    name: Name,
    ...args: Equal<Params, unknown> extends true ? [] : [params: Params]
  ): void {
    console.log('呵呵哒，开始发射了', name);

    this.eventBus.emit(name as any, (args as any)?.[0]);
  }

  public subscribe<
    Name extends ActionConfigName,
    Params extends ActionNameParamsMap[Name] = ActionNameParamsMap[Name]
  >(
    name: Name,
    handler: (
      ...args: Equal<Params, unknown> extends true ? [] : [params: Params]
    ) => void
  ) {
    console.log('呵呵哒，开始订阅了', name);

    this.eventBus.on(name, handler as any);
  }
}

export const actionController = new ActionController();

// actionController.emit('sidebar-switch', { name: '有一种悲伤，是你的名字停留在我的过往' });

// actionController.emit('desktop:close-app');

// actionController.subscribe('sidebar-switch', params => {});

// actionController.subscribe('desktop:close-app', () => {});
