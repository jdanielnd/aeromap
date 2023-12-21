import { BrowserWindow, IpcMainEvent, app, ipcMain } from 'electron';
import * as net from 'net';

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 10747;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_INTERVAL = 5000; // 5 seconds

class AerowinxConnection {
  client: net.Socket;
  reconnectAttempts = 0;
  host: string;
  port: number;
  win: BrowserWindow;
  logAllEvents: boolean;
  autoConnect: boolean;

  constructor(win: BrowserWindow, logAllEvents = false) {
    this.host = DEFAULT_HOST;
    this.port = DEFAULT_PORT;
    this.client = new net.Socket();
    this.win = win;
    this.logAllEvents = logAllEvents;
    this.autoConnect = true;
    this.setupListeners();
  }

  connect(host: string = this.host, port: number = this.port, resetReconnectAttempts = false) {
    this.host = host;
    this.port = port;
    if(resetReconnectAttempts) {
      this.reconnectAttempts = 0;
    }
    this.client.connect(this.port, this.host, () => {
      console.log(`Connected to Aerowinx at ${this.host}:${this.port}`);
      this.win?.webContents?.send('aerowinx:connected')
      this.reconnectAttempts = 0; // Reset the counter on successful connection
    });
  }

  setupListeners() {
    this.client.on('data', (data: string) => {
      const str = data.toString();
      console.log('Received:', str);
      if (str.startsWith('Qs121')) {
        const obj = parseQs121(str);
        this.win?.webContents?.send('aerowinx:qs121', obj);
      } else if (this.logAllEvents) {
        this.win?.webContents?.send('aerowinx:data', str);
      }
    });

    this.client.on('close', () => {
      console.log('Connection closed');
      this.win?.webContents?.send('aerowinx:closed');
      if (this.win) {
        this.attemptReconnect();
      }
    });

    this.client.on('error', (error: Error) => {
      const str = error.toString();
      console.error('Socket error:', str);
      this.win?.webContents?.send('aerowinx:error', str);
    });

    this.client.on('timeout', () => {
      console.log('Socket timeout');
      this.win?.webContents?.send('aerowinx:timeout');
      this.attemptReconnect();
    });
  }

  attemptReconnect() {
    if (!this.autoConnect) {
      return;
    }
    if (this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      setTimeout(() => {
        console.log(`Attempting to reconnect... (Attempt ${this.reconnectAttempts + 1})`);
        this.reconnectAttempts++;
        this.connect();
      }, RECONNECT_INTERVAL);
    } else {
      console.log('Max reconnect attempts reached, giving up');
    }
  }

  close() {
    this.client.resetAndDestroy();
    console.log('Connection manually closed');
  }

  destroy() {
    this.client.removeAllListeners();
    this.client.on('error', (error) => { 
      console.log('Error: ', error); 
     })
    this.client.resetAndDestroy();
    console.log('Connection destroyed');
  }
}

function parseQs121(message: string) {
  // Splitting the message into code and parameters
  const parts = message.split('=');
  const params = parts[1].split(';').map(Number);

  const heading = toDegrees(params[2]);
  const lat = toDegrees(params[5]);
  const lon = toDegrees(params[6]);

  // Creating the parsed object
  return {
    pitch: params[0],
    bank: params[1],
    heading,
    altitude: params[3],
    tas: params[4],
    lat,
    lon
  };
}

function toDegrees(radians: number) {
  return radians * (180 / Math.PI);
}

const createAerowinxConnection = (win: BrowserWindow) => {
  let aerowinxSocket = new AerowinxConnection(win);

  const connectListener = (event: IpcMainEvent, { host, port }: { host: string, port: number }) => {
    console.log(`Trying to connect to Aerowinx at ${host}:${port}`);
    aerowinxSocket.connect(host, port, true);
  }
  ipcMain.on('aerowinx:connect', connectListener);

  const closeListener = () => {
    aerowinxSocket.close();
  }
  ipcMain.on('aerowinx:close', closeListener);

  ipcMain.on('aerowinx:autoconnect', (event: IpcMainEvent, autoConnect: boolean) => {
    aerowinxSocket.autoConnect = autoConnect;
    console.log("autoConnect: ", autoConnect)
  });

  function clearSocket() {
    if (aerowinxSocket) {
      aerowinxSocket.destroy();
    }
    ipcMain.off('aerowinx:connect', connectListener);
    ipcMain.off('aerowinx:close', closeListener);
  }

  win.on('close', clearSocket);
  app.on('before-quit', clearSocket);
}

export default AerowinxConnection;
export { createAerowinxConnection };
