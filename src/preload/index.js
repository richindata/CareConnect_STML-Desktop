import { contextBridge, ipcRenderer } from 'electron';

// Expose a minimal, explicit API to the renderer. Nothing else from Node or
// Electron leaks into the page because contextIsolation is enabled.
contextBridge.exposeInMainWorld('careconnect', {
  getVersions: () => ipcRenderer.invoke('app:getVersions'),

  // Subscribe to navigation requests coming from the native menu. Returns an
  // unsubscribe function so React effects can clean up.
  onNavigate: (callback) => {
    const listener = (_event, to) => callback(to);
    ipcRenderer.on('menu:navigate', listener);
    return () => ipcRenderer.removeListener('menu:navigate', listener);
  },

  // Subscribe to non-navigation menu actions (e.g. 'shortcuts', 'signout').
  onMenuAction: (callback) => {
    const listener = (_event, action) => callback(action);
    ipcRenderer.on('menu:action', listener);
    return () => ipcRenderer.removeListener('menu:action', listener);
  },
});
