import type { GetContentBetweenTwoChar } from '@mimi-utils/types';

import type { paths } from './schema';

type GetMethod<T> = keyof T;

type GetPutOrPostMethodParams<O> = O extends { body: { req: infer Result } }
  ? Result
  : void;

type GetDefaultMethodParams<O> = O extends { body: { query: infer Result } }
  ? Result
  : void;

type HasParameters<O> = O extends { parameters: infer Result } ? Result : O;

type GetParamsByMethod<M, O, T = HasParameters<O>> = T extends null
  ? void
  : M extends 'put' | 'post'
  ? GetPutOrPostMethodParams<T>
  : M extends 'get'
  ? GetDefaultMethodParams<HasParameters<T>>
  : void;

type APISchema = {
  [Path in keyof paths]: {
    method: GetMethod<paths[Path]>;
  } & (GetContentBetweenTwoChar<Path, '{', '}'> extends never
    ? {}
    : {
        urlPlaceholder: Record<GetContentBetweenTwoChar<Path, '{', '}'>, string>;
      }) &
    (GetParamsByMethod<
      GetMethod<paths[Path]>,
      paths[Path][GetMethod<paths[Path]>]
    > extends void
      ? {}
      : {
          params: GetParamsByMethod<
            GetMethod<paths[Path]>,
            paths[Path][GetMethod<paths[Path]>]
          > &
            Record<string, any>;
        });
};

interface APIResponse<T = any> {
  code: number;
  data: T;
  msg: string;
  success: boolean;
}

declare module 'axios' {
  interface AxiosInstance extends Axios {
    <U extends 'xxxx' | 'bbbbb' | (string & {})>(
      url: U,
      config?: AxiosRequestConfig<APISchema[U]>
    ): AxiosPromise;
  }
}

export type { APIResponse, APISchema };
