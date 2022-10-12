import type { AxiosRequestConfig } from 'axios';
import Axios from 'axios';
import { APIResponse } from './types';

import { getToken } from './utils';

function authRequestInterceptor(config: AxiosRequestConfig) {
  const token = getToken();

  if (token) {
    config.headers!.authorization = `${token}`;
  }

  config.headers!.Accept = 'application/json';

  return config;
}

export const axiosInstance = Axios.create({
  baseURL: 'https://bb-typing.tyu.wiki/'
});

axiosInstance.interceptors.request.use(authRequestInterceptor);
axiosInstance.interceptors.response.use(
  response => {
    const data: APIResponse = response.data;

    if (data.code !== 20000) {
      throw data;
    }

    return data;
  },
  error => {
    return Promise.reject(error);
  }
);
