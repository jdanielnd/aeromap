const { app, BrowserWindow } = require('electron');
const path = require('path');
const net = require('net');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
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

app.on('uncaughtException', function(error){
  console.log(error)
});

const { ipcMain } = require('electron')

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

let position = { lat: 0, hdg: 0, lng: 0 };

// Create socket
let port = 10747;
let host = '127.0.0.1';
let timeout = 1000;
let retrying = false;
let connected = false;

// Functions to handle socket events
function makeConnection () {
    socket.connect(port, host);
}
function connectEventHandler() {
    console.log('connected');
    retrying = false;
    connected = true;
}
function endEventHandler() {
    console.log('end');
}
function timeoutEventHandler() {
    console.log('timeout');
}
function drainEventHandler() {
    console.log('drain');
}
function errorEventHandler(error) {
    console.log(error);
}
function closeEventHandler () {
    // console.log('close');
    if (!retrying) {
        connected = false;
        retrying = true;
        console.log('Reconnecting...');
    }
    setTimeout(makeConnection, timeout);
}

// Create socket and bind callbacks
var socket = new net.Socket();
socket.on('connect', connectEventHandler);
socket.on('end',     endEventHandler);
socket.on('timeout', timeoutEventHandler);
socket.on('drain',   drainEventHandler);
socket.on('error',   errorEventHandler);
socket.on('close',   closeEventHandler);

// Connect
console.log('Connecting to ' + host + ':' + port + '...');
makeConnection();

socket.on('data', function(data) {
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

ipcMain.on('position', (event, arg) => {
  event.reply('position-reply', {
    lat: position.lat,
    lng: position.lng,
    hdg: position.hdg
  })
})

ipcMain.on('connection', (event, arg) => {
  event.reply('connection-reply', connected)
})
