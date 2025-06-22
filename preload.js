const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  launch: command => ipcRenderer.send('launch', command),
  loadConfig: () => ipcRenderer.invoke('load-config'),
  hideWindow: () => ipcRenderer.send('hide-window'),
  onHotkey: cb => ipcRenderer.on('hotkey', cb),
});
