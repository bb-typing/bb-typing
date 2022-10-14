import type { NotificationProps } from '@mantine/core';
import type { AxiosRequestConfig } from 'axios';
import type { Simplify } from 'type-fest';

import type { paths } from './schema';

namespace GetParamsByMethod {
  type ByPost<O> = O extends {
    requestBody: { content: { 'application/json': infer Result } };
  }
    ? Result
    : [never, '无 post 参数信息'];

  type ByGet<O> = O extends { parameters: { query: infer Result } }
    ? Result
    : [never, '无 get 参数信息'];

  export type _<Method, OperationInfo> = Method extends 'post'
    ? ByPost<OperationInfo>
    : Method extends 'get'
    ? ByGet<OperationInfo>
    : void;
}

namespace GetResponse {
  type By200<O> = O extends {
    responses: { 200: { content: { '*/*': infer Result } } };
  }
    ? Result
    : [never, '无 200 响应信息'];

  export type _<OperationInfo> = By200<OperationInfo>;
}

type GetURLPlaceholder<Body> = Body extends {
  parameters: { path: infer P extends Record<string, string> };
}
  ? {
      [K in keyof P]: P[K] | AnyString;
    }
  : unknown;

type FilterParams<P> = P extends Array<unknown>
  ? [P[0]] extends [never]
    ? { params: never }
    : { params: P }
  : { params: P };

type GetCoreInfo<
  Path extends keyof paths,
  Method extends keyof paths[Path],
  Body extends paths[Path] = paths[Path]
> = {
  [M in Method]: {
    response: GetResponse._<Body[M]>;
    urlPlaceholder: GetURLPlaceholder<Body[M]>;
  } & FilterParams<GetParamsByMethod._<M, Body[M]>>;
};

export type APISchema = {
  [Path in keyof paths]: Simplify<GetCoreInfo<Path, keyof paths[Path]>>;
};

export interface APIResponse<T = any> {
  code: number;
  result: T;
  message: string;
}

export type APIPath = keyof APISchema;

export type GetAPIResponse<
  Path extends APIPath,
  Method extends keyof APISchema[Path]
> = APISchema[Path][Method]['response'];

export interface InternalConfig {
  /**
   * @default true
   */
  popupErrorPrompt?: boolean | (Partial<NotificationProps> & {});
}

export type RequestConfig = AxiosRequestConfig & {
  _internal: Required<InternalConfig>;
};

declare module 'axios' {
  interface AxiosInstance extends Axios {
    <U extends APIPath, M extends keyof APISchema[U]>(
      url: U | AnyString,
      config?: Omit<RequestConfig, 'data' | 'params' | 'method'> & {
        method?: M | AnyString;
        data?: APISchema[U][M]['params'];
        params?: APISchema[U][M]['params'];
      }
    ): AxiosPromise;
  }
}
