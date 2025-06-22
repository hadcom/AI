const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  launch: command => ipcRenderer.send('launch', command),
  loadConfig: () => ipcRenderer.invoke('load-config'),
});
