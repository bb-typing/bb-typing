import type { Simplify } from 'type-fest';

import type { paths } from './schema';

namespace GetParamsByMethod {
  export type ByPost<O> = O extends {
    requestBody: { content: { 'application/json': infer Result } };
  }
    ? Result
    : [never, '无 post 参数信息'];

  export type ByGet<O> = O extends { parameters: { query: infer Result } }
    ? Result
    : [never, '无 get 参数信息'];
}

type GetParamsByMethod<Method, OperationInfo> = Method extends 'post'
  ? GetParamsByMethod.ByPost<OperationInfo>
  : Method extends 'get'
  ? GetParamsByMethod.ByGet<OperationInfo>
  : void;

type GetCoreInfo<Path extends keyof paths, Method extends keyof paths[Path]> = {
  method: Method;
  params: GetParamsByMethod<Method, paths[Path][Method]> & Record<string, any>;
};

type APISchema = {
  [Path in keyof paths]: Simplify<GetCoreInfo<Path, keyof paths[Path]>>;
};
interface APIResponse<T = any> {
  code: number;
  data: T;
  msg: string;
  success: boolean;
}

type APIPath = keyof APISchema;

declare module 'axios' {
  interface AxiosInstance extends Axios {
    <U extends APIPath>(
      url: U,
      config?: Omit<AxiosRequestConfig, 'data' | 'params'> & {
        method?: APISchema[U]['method'] | (string & {});
        data?: APISchema[U]['params'];
        params?: APISchema[U]['params'];
      }
    ): AxiosPromise;
  }
}

export type { APIResponse, APISchema };
