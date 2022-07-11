import type { PlatformName } from '../libs/platform';

declare global {
  declare const __APP_ENV__: PlatformName;
}
