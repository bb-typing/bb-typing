export interface ContextBridgeAPI {
  /**
   * 测试函数
   */
  test: (delaySecond: number) => Promise<string>;
}

declare global {
  interface Window {
    mainProcessAPI: ContextBridgeAPI;
  }

  const mainProcessAPI: ContextBridgeAPI;
}
