// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  connect: () => ipcRenderer.send('connection'),
  setConnected: (setConnected: Function) => {
    ipcRenderer.on('connection-reply', (event, arg) => {
      setConnected(arg)
    })
  },
  getPosition: () => ipcRenderer.invoke('position:get'),
  getConnection: () => ipcRenderer.invoke('connection:get'),
  setAlwaysOnTop: (alwaysOnTop: boolean) => ipcRenderer.send('always-on-top:set', alwaysOnTop),
  getAlwaysOnTop: () => ipcRenderer.invoke('always-on-top:get'),
  getHost: () => ipcRenderer.invoke('host:get'),
  setHost: (host: string) => ipcRenderer.send('host:set', host),
  getPort: () => ipcRenderer.invoke('port:get'),
  setPort: (port: string) => ipcRenderer.send('port:set', port),
})

// Define a type for the callback function
type CallbackFunction = (...args: any[]) => void;

contextBridge.exposeInMainWorld('aerowinxApi', {
  connect: ({ host, port }: { host: string, port: number}) => {
    ipcRenderer.send('aerowinx:connect', { host, port });
  },

  close: () => {
    ipcRenderer.send('aerowinx:close');
  },

  onConnected: (callback: CallbackFunction) => {
    ipcRenderer.on('aerowinx:connected', callback);
  },

  onReady: (callback: CallbackFunction) => {
    ipcRenderer.on('aerowinx:ready', callback);
  },

  onData: (callback: CallbackFunction) => {
    ipcRenderer.on('aerowinx:data', (_, data: string) => {
      callback(data);
    });
  },

  onQs121: (callback: CallbackFunction) => {
    ipcRenderer.on('aerowinx:qs121', (_, data: string) => {
      callback(data);
    });
  },

  onClosed: (callback: CallbackFunction) => {
    ipcRenderer.on('aerowinx:closed', callback);
  },

  onError: (callback: CallbackFunction) => {
    ipcRenderer.on('aerowinx:error', (_, error: string) => {
      callback(error);
    });
  },

  onTimeout: (callback: CallbackFunction) => {
    ipcRenderer.on('aerowinx:timeout', callback);
  },

  setAutoConnect: (autoConnect: boolean) => {
    ipcRenderer.send('aerowinx:autoconnect', autoConnect);
  },

  removeListeners: () => {
    ipcRenderer.removeAllListeners('aerowinx:connected');
    ipcRenderer.removeAllListeners('aerowinx:ready');
    ipcRenderer.removeAllListeners('aerowinx:data');
    ipcRenderer.removeAllListeners('aerowinx:qs121');
    ipcRenderer.removeAllListeners('aerowinx:closed');
    ipcRenderer.removeAllListeners('aerowinx:error');
    ipcRenderer.removeAllListeners('aerowinx:timeout');
  },
});
