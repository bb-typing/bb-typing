import mitt from 'mitt';

import type { ActionConfigNames, ActionNameParamsMap } from './types';

class ActionController {
  eventBus = mitt<ActionNameParamsMap>();
  constructor() {}

  emit(name: ActionConfigNames): void {}
}

export {};
