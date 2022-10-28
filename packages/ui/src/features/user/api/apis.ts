import { defineRequest } from '@ui/core/request/utils';

export const apiUserLogin = defineRequest('/typing-service/account/login', 'post');

export const apiUserRegister = defineRequest('/typing-service/account/register', 'post');

export const apiGetUserSetting = defineRequest(
  '/typing-service/account/setting/{type}',
  'get'
);

export const apiSaveUserSetting = defineRequest(
  '/typing-service/account/setting/{type}',
  'post'
);

export const apiUserCheckToken = defineRequest(
  '/typing-service/account/checkToken',
  'post'
);
