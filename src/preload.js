const { contextBridge, ipcRenderer } = require('electron');

// Expose a minimal, explicit API to the renderer. Nothing else from Node
// or Electron leaks into the page because contextIsolation is enabled.
contextBridge.exposeInMainWorld('careconnect', {
  getVersions: () => ipcRenderer.invoke('app:getVersions'),
});
