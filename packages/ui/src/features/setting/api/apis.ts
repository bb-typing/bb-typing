import { defineRequest } from '@ui/core/request/utils';

export const apiUserShortcutSave = defineRequest(
  '/typing-service/account/setting/{type}',
  'post'
);

export const apiUserShortcutGet = defineRequest(
  '/typing-service/account/setting/{type}',
  'get'
);
