import mitt from 'mitt';

import type { ActionConfigNames } from './config';
import { actionConfigs } from './config';
import type { ActionNameParamsMap, actionNameParamsOfNull } from './name-params-map.type';

export class ActionController {
  private eventBus = mitt<ActionNameParamsMap>();
  private actions = actionConfigs;

  emit<Name extends ActionConfigNames, Params extends ActionNameParamsMap[Name] = ActionNameParamsMap[Name]>(
    name: Name,
    ...args: Params extends typeof actionNameParamsOfNull ? [] : [params: Params]
  ): void {
    this.eventBus.emit(name as any, (args as any)?.[0]);
  }

  subscribe<Name extends ActionConfigNames, Params extends ActionNameParamsMap[Name] = ActionNameParamsMap[Name]>(
    name: Name,
    handler: (...args: Params extends typeof actionNameParamsOfNull ? [] : [params: Params]) => void
  ) {
    this.eventBus.on(name, handler as any);
  }
}

// const actionController = new ActionController();

// actionController.emit('sidebar-switch');

// actionController.emit('desktop:close-app', { name: '做不完一场梦' });

// actionController.subscribe('sidebar-switch', () => {});

// actionController.subscribe('desktop:close-app', params => {
//   console.log('params', params);
// });
