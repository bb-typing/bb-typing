declare const __APP_IS_DESKTOP__: true | undefined;

declare const __APP_IS_ANDROID__: true | undefined;

declare interface Window {
  __APP_IS_DESKTOP__: true | undefined;
  __APP_IS_ANDROID__: true | undefined;
}

declare type AnyString = string & {};
