import { contextBridge, ipcRenderer } from 'electron';
import type { ContextBridgeAPI } from './types';

const exposedAPI: ContextBridgeAPI = {
  test: delaySecond => ipcRenderer.invoke('getComputerInfo', delaySecond)
};

contextBridge.exposeInMainWorld('mainProcessAPI', exposedAPI);
