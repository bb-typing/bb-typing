import type { Simplify } from 'type-fest';

import type { paths } from './schema';
import type { GetContentBetweenTwoChar } from '@mimi-utils/types';

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

type GetCoreInfo<Path extends keyof paths, Method extends keyof paths[Path]> = {
  [M in Method]: {
    params: GetParamsByMethod._<Method, paths[Path][Method]>;
    response: GetResponse._<paths[Path][Method]>;
    urlPlaceholder: Record<GetContentBetweenTwoChar<Path, '{', '}'>, string>;
  };
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

declare module 'axios' {
  interface AxiosInstance extends Axios {
    <U extends APIPath, M extends keyof APISchema[U]>(
      url: U,
      config?: Omit<AxiosRequestConfig, 'data' | 'params' | 'method'> & {
        method?: M | AnyString;
        data?: APISchema[U][M]['params'];
        params?: APISchema[U][M]['params'];
      }
    ): AxiosPromise;
  }
}
