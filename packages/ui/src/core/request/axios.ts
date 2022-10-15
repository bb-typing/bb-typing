import { useUserStore } from '@ui/features/user/store';
import type { AxiosRequestConfig } from 'axios';
import Axios from 'axios';

import type { APIResponse, RequestConfig } from './types';
import { errorMessagePopup } from './utils';

function authRequestInterceptor(config: AxiosRequestConfig) {
  const { token } = useUserStore.getState().userInfo ?? {};

  if (token) {
    config.headers!.Authorization = `Bearer ${token}`;
  }

  config.headers!['Content-Type'] = 'application/json';

  return config;
}

export const axiosInstance = Axios.create({
  baseURL: 'https://bb-typing.tyu.wiki/'
});

axiosInstance.interceptors.request.use(authRequestInterceptor);
axiosInstance.interceptors.response.use(
  response => {
    const data: APIResponse = response.data;
    const config = response.config as RequestConfig;

    if (data.code !== 20000) {
      const { popupErrorPrompt } = config._internal;

      if (popupErrorPrompt) {
        errorMessagePopup(
          data.code as any,
          typeof popupErrorPrompt === 'boolean' ? undefined : popupErrorPrompt
        );
      }

      throw data;
    }

    return data.result;
  },
  error => {
    return Promise.reject(error);
  }
);
