import { app, BrowserWindow } from 'electron';
import path from 'path';
import { ipcMain } from 'electron'
import { connectAerowinx } from 'common/aerowinx';

// get environment type
const isDevelopment = process.env.NODE_ENV !== 'production';

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    alwaysOnTop: true
  });

  // load HTML file
  if( isDevelopment ) {
    mainWindow.loadURL( `http://${ process.env.ELECTRON_WEBPACK_WDS_HOST }:${ process.env.ELECTRON_WEBPACK_WDS_PORT }` );
  } else {
    mainWindow.loadFile( path.resolve( __dirname, 'index.html' ) );
  }

  ipcMain.on('always-on-top', (event, arg) => {
    mainWindow.setAlwaysOnTop(arg)
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

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

connectAerowinx();
