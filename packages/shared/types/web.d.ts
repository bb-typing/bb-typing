import type { PlatformName } from './base';

declare global {
  declare const __APP_ENV__: PlatformName;

  declare interface Window {
    __APP_ENV__: PlatformName;
  }
}
