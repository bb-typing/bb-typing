import { showNotification } from '@mantine/notifications';
import type { Equal } from '@type-challenges/utils';
import type { AxiosRequestConfig } from 'axios';
import type { O, U } from 'ts-toolbelt';

import { axiosInstance } from './axios';
import type { ErrorCode } from './error-code';
import { errorCodeStatus } from './error-code';
import type { APIPath, APISchema, InternalConfig } from './types';

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
  type FilteredURLPlaceholder = HasURLPlaceholder extends true
    ? { urlPlaceholder: URLPlaceholder }
    : {};

  type FilterParams<P> = [P] extends [never]
    ? { params?: Partial<Record<AnyString | '无参数', unknown>> }
    : { params?: P };

  type Options = InternalConfig &
    FilteredURLPlaceholder &
    FilterParams<APISchema[T][M]['params'] | Record<string, unknown>>;

  return (
    ...args: Equal<O.RequiredKeys<Options>, never> extends true
      ? [options?: Options, axiosConfig?: Partial<AxiosRequestConfig>]
      : [options: Options, axiosConfig?: Partial<AxiosRequestConfig>]
  ) => {
    const [options = {}, axiosConfig] = args;

    const { params, popupErrorPrompt = true } = options;

    const filteredURL = (() => {
      if ('urlPlaceholder' in options) {
        let filteredURL = url as any;

        Object.entries(options.urlPlaceholder as Record<string, string>).forEach(
          ([placeholder, value]) => {
            filteredURL = filteredURL.replace(`{${placeholder}}`, value);
          }
        );

        return filteredURL;
      }

      return url;
    })();

    return axiosInstance(filteredURL, {
      method,
      ...(![null, undefined].includes(params as any) && method === 'post'
        ? { data: params }
        : { params }),
      ...axiosConfig,
      _internal: { popupErrorPrompt }
    }) as Promise<Response>;
  };
}

export function errorMessagePopup(
  errorCode: ErrorCode,
  popupConfig?: Exclude<InternalConfig['popupErrorPrompt'], boolean>
) {
  const errorMessage = errorCodeStatus.toEnum()[errorCode];

  if (errorMessage) {
    showNotification({
      title: '错误提示',
      color: 'red',
      message: errorMessage,
      ...popupConfig
    });
  } else {
    throw new Error(`存在未定义的 error-code：${errorCode}`);
  }
}
