import { ipcMain } from 'electron';

ipcMain.on('getComputerInfo', (_, ...args) => {
  const [delaySecond] = args;

  console.log('哦，访问到了');
});
