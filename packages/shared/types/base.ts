export type PlatformName =
  | 'desktop:win'
  | 'desktop:mac'
  | 'web:mac'
  | 'web:win'
  | 'web:android-ios'
  | 'android:web';

export function defineVariables<T>() {
  return <C extends T>(value: C) => value;
}

export function defineType<T>(): T {
  // @ts-expect-error
  return '' as unknown;
}
