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