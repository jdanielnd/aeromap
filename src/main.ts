import { app, BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import path from 'path';
import { createAerowinxConnection } from './lib/aerowinx-connection';
import { windowStateKeeper } from './lib/window-size';
import { alwaysOnTopStateKeeper } from './lib/always-on-top';
import settings from 'electron-settings';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = async () => {
  const mainWindowStateKeeper = await windowStateKeeper('main');
  const mainAlwaysOnTopStateKeeper = await alwaysOnTopStateKeeper('main');

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    x: mainWindowStateKeeper.x,
    y: mainWindowStateKeeper.y,
    width: mainWindowStateKeeper.width,
    height: mainWindowStateKeeper.height,
    alwaysOnTop: mainAlwaysOnTopStateKeeper.alwaysOnTopState,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
  mainWindowStateKeeper.track(mainWindow);

  const setAlwaysOnTop = (event: IpcMainEvent, state: boolean) => {
    mainAlwaysOnTopStateKeeper.setAlwaysOnTopState(state);
    if(state) {
      mainWindow.setAlwaysOnTop(state, 'screen-saver');
    } else {
      mainWindow.setAlwaysOnTop(state, 'normal');
    }
  }

  ipcMain.on('always-on-top:set', setAlwaysOnTop);
  ipcMain.handle('always-on-top:get', async () => {
    return mainAlwaysOnTopStateKeeper.alwaysOnTopState;
  });

  createAerowinxConnection(mainWindow);

  mainWindow.on('close', function () {
    ipcMain.removeHandler('always-on-top:get');
    ipcMain.removeListener('always-on-top:set', setAlwaysOnTop);
  });

  return mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.handle('host:set', async (event, data) => {
  await settings.set('host', data);
});
ipcMain.handle('host:get', async () => {
  return await settings.get('host');
});
ipcMain.handle('port:set', async (event, data) => {
  await settings.set('port', data);
});
ipcMain.handle('port:get', async () => {
  return await settings.get('port');
});