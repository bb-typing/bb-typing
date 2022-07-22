import type { Equal } from '@type-challenges/utils';
import mitt from 'mitt';

import { actionConfigModules } from './configs';
import type { ActionConfigName, ActionNameParamsMap } from './types';

export class ActionController {
  private eventBus = mitt<ActionNameParamsMap>();
  private actions = actionConfigModules;

  emit<Name extends ActionConfigName, Params extends ActionNameParamsMap[Name] = ActionNameParamsMap[Name]>(
    name: Name,
    ...args: Equal<Params, unknown> extends true ? [] : [params: Params]
  ): void {
    this.eventBus.emit(name as any, (args as any)?.[0]);
  }

  subscribe<Name extends ActionConfigName, Params extends ActionNameParamsMap[Name] = ActionNameParamsMap[Name]>(
    name: Name,
    handler: (...args: Equal<Params, unknown> extends true ? [] : [params: Params]) => void
  ) {
    this.eventBus.on(name, handler as any);
  }
}

export const actionController = new ActionController();

// actionController.emit('sidebar-switch', { name: '有一种悲伤，是你的名字停留在我的过往' });

// actionController.emit('desktop:close-app');

// actionController.subscribe('sidebar-switch', params => {});

// actionController.subscribe('desktop:close-app', () => {});
