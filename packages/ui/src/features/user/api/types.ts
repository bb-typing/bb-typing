/**
 * 此处只定义与 `API` 相关的类型
 * 与 `view, component, ...` 有关的类型（即：非 `API` 的类型），请定义在 `model.ts` 中
 */

import { APISchema } from '@ui/core/axios/types';

declare global {
  namespace APIUser {
    export namespace Login {
      export type Req = APISchema['/typing-service/account/login']['post']['params'];

      export type Resp =
        APISchema['/typing-service/account/login']['post']['response']['result'];
    }
  }
}
