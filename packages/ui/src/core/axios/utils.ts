import { AxiosRequestConfig } from 'axios';
import { axiosInstance } from '.';
import { APIPath, APISchema } from './types';
import { U } from 'ts-toolbelt';

export function getToken(): string {
  return JSON.parse(localStorage.getItem(`bb_typewrite_token`) as string);
}

export function defineRequest<T extends APIPath, M extends keyof APISchema[T]>(
  url: T,
  method: M
) {
  type R = APISchema[T][M]['response'];
  type Response = R extends { result?: infer Result } ? Result : R;

  type URLPlaceholder = APISchema[T][M]['urlPlaceholder'];
  type HasURLPlaceholder = U.ListOf<keyof URLPlaceholder>['length'] extends 0
    ? false
    : true;

  return (
    options: {
      params: APISchema[T][M]['params'] & Record<string, unknown>;
    } & (HasURLPlaceholder extends true ? { urlPlaceholder: URLPlaceholder } : {}),
    axiosConfig: Partial<AxiosRequestConfig> = {}
  ) => {
    const { params } = options;

    const filteredURL = (() => {
      if ('urlPlaceholder' in options) {
        let filteredURL = url as any;

        Object.entries(options.urlPlaceholder).forEach(([placeholder, value]) => {
          filteredURL = filteredURL.replace(`{${placeholder}}`, value);
        });

        return filteredURL;
      }
      return url;
    })();

    return axiosInstance(filteredURL, {
      method,
      ...(method === 'post' ? { data: params } : { params }),
      ...axiosConfig
    }) as Promise<Response>;
  };
}
