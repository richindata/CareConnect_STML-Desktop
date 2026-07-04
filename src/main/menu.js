// Native application menu with keyboard accelerators. Navigation items send an
// IPC message to the renderer, which drives React Router. The dashboard's
// Ctrl+1..6 / Ctrl+/ keys are handled inside the renderer, so those menu items
// display their accelerator (registerAccelerator: false) without registering it
// twice.
import { app, Menu, shell, dialog } from 'electron';

const isMac = process.platform === 'darwin';

export function buildAppMenu(win) {
  const navigate = (to) => win?.webContents.send('menu:navigate', to);
  const action = (name) => win?.webContents.send('menu:action', name);

  const showAbout = () => {
    dialog.showMessageBox(win, {
      type: 'info',
      title: 'About CareConnect STML',
      message: 'CareConnect STML',
      detail:
        `A calm daily companion for patients living with short-term memory loss.\n\n` +
        `Version ${app.getVersion()}\n` +
        `Electron ${process.versions.electron}\n` +
        `Chromium ${process.versions.chrome}\n` +
        `Node ${process.versions.node}`,
      buttons: ['OK'],
    });
  };

  const navItem = (label, digit, to) => ({
    label,
    accelerator: `CmdOrCtrl+${digit}`,
    registerAccelerator: false, // renderer handles the key; this is display-only
    click: () => navigate(to),
  });

  /** @type {import('electron').MenuItemConstructorOptions[]} */
  const template = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { label: 'About CareConnect STML', click: showAbout },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' },
            ],
          },
        ]
      : []),

    // File
    {
      label: 'File',
      submenu: [
        { label: 'New…', accelerator: 'CmdOrCtrl+N', registerAccelerator: false, click: () => action('new') },
        { label: 'New Journal Entry', accelerator: 'CmdOrCtrl+J', registerAccelerator: false, click: () => navigate('/app/journal') },
        { type: 'separator' },
        { label: 'Print Daily Plan', accelerator: 'CmdOrCtrl+P', registerAccelerator: false, click: () => action('print') },
        { type: 'separator' },
        { label: 'Sign Out', accelerator: 'Ctrl+Q', registerAccelerator: false, click: () => action('signout') },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },

    // Edit (kept for native text editing on inputs)
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },

    // View
    {
      label: 'View',
      submenu: [
        navItem('Home', 1, '/app'),
        navItem('Daily Plan', 2, '/app/daily-plan'),
        navItem('Medications', 3, '/app/medications'),
        navItem('Reminders', 4, '/app/reminders'),
        navItem('Journal', 5, '/app/journal'),
        navItem('Settings', 6, '/app/settings'),
        { type: 'separator' },
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },

    // Tools
    {
      label: 'Tools',
      submenu: [
        { label: 'Keyboard Shortcuts', accelerator: 'CmdOrCtrl+/', registerAccelerator: false, click: () => action('shortcuts') },
        { label: 'Settings', accelerator: 'CmdOrCtrl+6', registerAccelerator: false, click: () => navigate('/app/settings') },
        { type: 'separator' },
        { label: 'Bigger Text', accelerator: 'CmdOrCtrl+=', registerAccelerator: false, click: () => action('bigger-text') },
        { label: 'Smaller Text', accelerator: 'CmdOrCtrl+-', registerAccelerator: false, click: () => action('smaller-text') },
        { label: 'High Contrast', accelerator: 'Ctrl+H', registerAccelerator: false, click: () => action('high-contrast') },
        { type: 'separator' },
        { label: 'Emergency Contact', accelerator: 'F9', registerAccelerator: false, click: () => action('emergency') },
      ],
    },

    // Window
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [{ type: 'separator' }, { role: 'front' }] : [{ role: 'close' }]),
      ],
    },

    // Help
    {
      role: 'help',
      submenu: [
        { label: 'Keyboard Shortcuts', accelerator: 'F1', registerAccelerator: false, click: () => action('shortcuts') },
        { label: 'Learn More', click: () => shell.openExternal('https://www.electronjs.org') },
        ...(isMac ? [] : [{ type: 'separator' }, { label: 'About CareConnect STML', click: showAbout }]),
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  return menu;
}
