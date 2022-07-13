export type { SystemStoreActions, SystemStoreState };

interface SystemStoreState {
  currentLocale: string;
}

interface SystemStoreActions {
  setCurrentLocale(locale: SystemStoreState['currentLocale']): void;
}
