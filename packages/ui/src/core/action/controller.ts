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
    ...args: Equal<Params, unknown> extends true ? [] : [params?: Params]
  ): void {
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
    this.eventBus.on(name, handler as any);
  }
}

export const actionController = new ActionController();
