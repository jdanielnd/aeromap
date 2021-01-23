import { app, BrowserWindow } from 'electron';
import net from 'net';
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

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

let position = { lat: 0, hdg: 0, lng: 0 };

var client = new net.Socket();
client.connect(10747, '127.0.0.1', function() {
  console.log('Connected');
});

client.on('data', function(data) {
  if(/^Qs121/.test(data.toString())) {
    let str = ''+data
    let dataSplit = str.split(";");
    let hdg = +dataSplit[2] * 180 / Math.PI
    let lat = +dataSplit[5] * 180 / Math.PI
    let lon = +dataSplit[6] * 180 / Math.PI
    if(!isNaN(hdg) && !isNaN(lat) && !isNaN(lon)) {
      position = {
        hdg: hdg,
        lat: lat,
        lng: lon
      }
    }
  }
});

const { ipcMain } = require('electron')
ipcMain.on('position', (event: { reply: (arg0: any, arg1: any) => void; }, arg: any) => {
  console.log(arg) // prints "ping"
  event.reply('position-reply', { lat: position.lat, lng: position.lng })
})
