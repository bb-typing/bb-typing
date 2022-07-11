const utils = {
  isMac() {
    return __APP_ENV__ === 'mac';
  },
  isWin() {
    return __APP_ENV__ === 'win';
  },
  isDesktop() {
    return (['win', 'mac'] as Array<typeof __APP_ENV__>).includes(__APP_ENV__);
  },
  isWeb() {
    return __APP_ENV__ === 'web';
  },
  isAndroid() {
    return __APP_ENV__ === 'android';
  }
};

export const Platform = {
  OS: __APP_ENV__,
  isDesktop: utils.isDesktop(),
  isMac: utils.isMac(),
  isWin: utils.isWin(),
  isWeb: utils.isWeb(),
  isAndroid: utils.isAndroid()
} as const;
