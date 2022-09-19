import type { AxiosRequestConfig } from 'axios';
import Axios from 'axios';

import { getToken } from './utils';

function authRequestInterceptor(config: AxiosRequestConfig) {
  const token = getToken();

  if (token) {
    config.headers!.authorization = `${token}`;
  }

  config.headers!.Accept = 'application/json';

  return config;
}

export const axios = Axios.create({
  baseURL: 'http://127.0.0.1:5000/'
});

axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    return Promise.reject(error);
  }
);
