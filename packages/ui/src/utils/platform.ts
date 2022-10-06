import type { PlatformName } from '@shared/types/base';

const utils = {
  isMacos() {
    return /mac os x/i.test(navigator.userAgent);
  },
  isWindows() {
    return /windows|win32/i.test(navigator.userAgent);
  },
  isAndroid() {
    return window.__APP_IS_ANDROID__ === true;
  },

  isDesktop() {
    return window.__APP_IS_DESKTOP__ === true;
  },
  getPlatformName(): PlatformName {
    if (utils.isDesktop()) {
      return utils.isMacos() ? 'desktop:mac' : 'desktop:win';
    }

    if (utils.isAndroid()) {
      return 'android:web';
    }

    // 不是桌面应用，也不是安卓包壳？那就是纯浏览器了

    if (utils.isMacos()) {
      return 'web:mac';
    } else if (utils.isWindows()) {
      return 'web:win';
    }

    // 都不是？那就是 android/ios 了

    return 'web:android-ios';
  }
};

export const Platform = {
  OS: utils.getPlatformName(),
  isDesktop: utils.isDesktop(),
  isAndroid: utils.isAndroid(),
  isMacos: utils.isMacos(),
  isWindows: utils.isWindows()
} as const;
