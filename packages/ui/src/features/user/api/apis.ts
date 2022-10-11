import { defineRequest } from '@ui/core/axios/utils';

export const apiUserLogin = defineRequest('/typing-service/account/login', 'post');

export const apiUserRegister = defineRequest('/typing-service/account/register', 'post');
