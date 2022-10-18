import { useUserStore } from '@ui/features/user/store';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import Axios from 'axios';
import { P } from 'ts-toolbelt/out/Object/_api';

import type { APIResponse, RequestConfig } from './types';
import { errorMessagePopup } from './utils';

export const axiosInstance = Axios.create({
  baseURL: 'https://bb-typing.tyu.wiki/'
});

export const axiosInterceptor = {
  request: {
    auth(config: AxiosRequestConfig) {
      const { token } = useUserStore.getState().userInfo ?? {};

      if (token) {
        config.headers!.Authorization = `Bearer ${token}`;
      }

      config.headers!['Content-Type'] = 'application/json';

      return config;
    }
  },
  response: {
    noErrorAndFilterData(response: AxiosResponse<APIResponse, any>) {
      return response.data.result;
    },
    errorStatus(response: AxiosResponse<APIResponse, any>) {
      if (response.status === 200) return response;

      errorMessagePopup(response.status as any);

      throw response;
    },
    errorCode(response: AxiosResponse<APIResponse, any>) {
      const { data, config } = response;

      if (data.code !== 20000) {
        const {
          _internal: { popupErrorPrompt }
        } = config as RequestConfig;

        if (popupErrorPrompt) {
          errorMessagePopup(
            data.code as any,
            typeof popupErrorPrompt === 'boolean' ? undefined : popupErrorPrompt
          );
        }

        throw data;
      }
    }
  }
};

axiosInstance.interceptors.request.use(axiosInterceptor.request.auth);

axiosInstance.interceptors.response.use(axiosInterceptor.response.errorStatus);
axiosInstance.interceptors.response.use(
  axiosInterceptor.response.errorCode,
  Promise.reject
);
axiosInstance.interceptors.response.use(axiosInterceptor.response.noErrorAndFilterData);
