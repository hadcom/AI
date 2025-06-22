const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 400,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
    show: false,
  });

  mainWindow.loadFile('index.html');
}

function loadConfig() {
  const cfgPath = path.join(__dirname, 'config.json');
  if (fs.existsSync(cfgPath)) {
    return JSON.parse(fs.readFileSync(cfgPath));
  }
  return {};
}

app.whenReady().then(() => {
  createWindow();

  const config = loadConfig();
  if (config.hotkey) {
    globalShortcut.register(config.hotkey, () => {
      mainWindow.show();
      mainWindow.focus();
      mainWindow.webContents.send('hotkey');
    });
  } else {
    mainWindow.show();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('launch', (event, command) => {
  if (!command) return;
  spawn(command, { shell: true, detached: true });
});

ipcMain.on('hide-window', () => {
  mainWindow.hide();
});

ipcMain.handle('load-config', () => {
  return loadConfig();
});
