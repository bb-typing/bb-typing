interface IPCRendererSubMap {
  getComputerInfo: [delaySecond: number];
}

type IPCMainSubName = keyof IPCRendererSubMap;

declare namespace Electron {
  interface IpcMain {
    /**
     * Listens to `channel`, when a new message arrives `listener` would be called with
     * `listener(event, args...)`.
     */
    on<C extends IPCMainSubName, Args extends IPCRendererSubMap[C]>(
      channel: C,
      listener: (event: IpcMainEvent, ...args: Args) => void
    ): this;
  }
}
