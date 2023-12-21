// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  setAlwaysOnTop: (alwaysOnTop: boolean) => ipcRenderer.send('always-on-top:set', alwaysOnTop),
  getAlwaysOnTop: () => ipcRenderer.invoke('always-on-top:get'),
  setHost: (host: string) => ipcRenderer.invoke('host:set', host),
  getHost: async (): Promise<string> => ipcRenderer.invoke('host:get'),
  setPort: (port: number) => ipcRenderer.invoke('port:set', port),
  getPort: async (): Promise<number> => ipcRenderer.invoke('port:get'),
})

contextBridge.exposeInMainWorld('aerowinxApi', {
  connect: ({ host, port }: { host: string, port: number}) => {
    ipcRenderer.send('aerowinx:connect', { host, port });
  },

  close: () => {
    ipcRenderer.send('aerowinx:close');
  },

  onConnected: (callback: () => void) => {
    ipcRenderer.on('aerowinx:connected', callback);
  },

  onReady: (callback: () => void) => {
    ipcRenderer.on('aerowinx:ready', callback);
  },

  onData: (callback: (data: string) => void) => {
    ipcRenderer.on('aerowinx:data', (_, data: string) => {
      callback(data);
    });
  },

  onQs121: (callback: (data: string) => void) => {
    ipcRenderer.on('aerowinx:qs121', (_, data: string) => {
      callback(data);
    });
  },

  onClosed: (callback: () => void) => {
    ipcRenderer.on('aerowinx:closed', callback);
  },

  onError: (callback: (error: string) => void) => {
    ipcRenderer.on('aerowinx:error', (_, error: string) => {
      callback(error);
    });
  },

  onTimeout: (callback: () => void) => {
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
