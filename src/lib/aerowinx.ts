import net from 'net'
import { ipcMain } from 'electron'

interface Position {
  lat: number;
  hdg: number;
  lng: number;
}

export const connectAerowinx = () => {
  const position: Position = { lat: 0, hdg: 0, lng: 0 };
  let host = '127.0.0.1';
  let port = 10747;
  const timeout = 1000;

  let retrying = false;
  let connected = false;

  ipcMain.on('host:set', (event, arg) => {
    host = arg
  });

  ipcMain.on('port:set', (event, arg) => {
    port = arg
  });

  const socket = new net.Socket();

  const updatePosition = (data: string) => {
    const Qs121 = /(Qs121.+)/

    if (Qs121.test(data.toString())) {
      let str = data.toString().match(Qs121)[0]
      let dataSplit = str.split(";");
      let hdg = +dataSplit[2] * 180 / Math.PI
      let lat = +dataSplit[5] * 180 / Math.PI
      let lon = +dataSplit[6] * 180 / Math.PI
      if (!isNaN(hdg) && !isNaN(lat) && !isNaN(lon)) {
        position.hdg = hdg
        position.lat = lat
        position.lng = lon
      }
    }
  };

  const makeConnection = () => {
    socket.connect(port, host);
  };

  socket.on('connect', () => {
    console.log('Connected');
    retrying = false;
    connected = true;
  });

  socket.on('data', (data) => updatePosition(data.toString()));

  socket.on('close', () => {
    if (!retrying) {
      connected = false;
      retrying = true;
      console.log('Reconnecting...');
      setTimeout(makeConnection, timeout);
    }
  });

  // Functions to handle socket events
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
  function errorEventHandler(error: any) {
    console.log(error);
  }
  function closeEventHandler() {
    // console.log('close');
    if (!retrying) {
      connected = false;
      retrying = true;
      console.log('Reconnecting...');
    }
    setTimeout(makeConnection, timeout);
  }

  // Create socket and bind callbacks
  socket.on('connect', connectEventHandler);
  socket.on('end', endEventHandler);
  socket.on('timeout', timeoutEventHandler);
  socket.on('drain', drainEventHandler);
  socket.on('error', errorEventHandler);
  socket.on('close', closeEventHandler);

  ipcMain.on('ip-address', (event, arg) => {
    if (host != arg) {
      host = arg
      socket.destroy();
    }
  })

  ipcMain.handle('position:get', async () => position)
  ipcMain.handle('connection:get', async () => connected)

  ipcMain.on('connection', (event, arg) => {
    event.reply('connection-reply', connected)
  })

  // Connect
  console.log('Connecting to ' + host + ':' + port + '...');
  makeConnection();
}
