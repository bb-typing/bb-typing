import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  loadPreferences: () => ipcRenderer.invoke('load-prefs')
});

function createAPIMap<T extends string>(apiKey: T): T {
  return apiKey;
}

const name = createAPIMap('234');
