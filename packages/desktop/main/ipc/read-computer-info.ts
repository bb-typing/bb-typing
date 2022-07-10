import { ipcMain, app } from 'electron';
import { readdirSync } from 'fs';
import { resolve } from 'path';

ipcMain.handle('getComputerInfo', (_, ...args) => {
  const [delaySecond] = args;

  return `哦，你给了个---${app.getAppPath()}`;
});
