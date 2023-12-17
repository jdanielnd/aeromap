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
})