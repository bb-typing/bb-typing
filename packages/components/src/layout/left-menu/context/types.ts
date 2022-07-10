export interface Context {
  useStoreState(): Store.State;
  updateFoldingStatus(status: Store.State['foldingStatus']): void;
}

export namespace Store {
  export interface State {
    foldingStatus: 'none' | 'icon' | 'icon-text';
  }

  export interface Action {
    setFoldingStatus: (value: State['foldingStatus']) => void;
  }
}
