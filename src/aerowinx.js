const net = require('net');
const { ipcMain } = require('electron')

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
