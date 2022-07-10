/// <reference types="vite/client" />

declare global {
  interface Window {
    // Expose API through preload script
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    fs: typeof import('fs');
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    ipcRenderer: import('electron').IpcRenderer;
    removeLoading: () => void;
  }
}

export {};
