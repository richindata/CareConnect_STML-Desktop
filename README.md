# CareConnect_STML-Desktop

CareConnect STML Desktop Application — an [Electron](https://www.electronjs.org/) desktop app.

## Requirements

- Node.js 18+ and npm

## Setup

```bash
npm install
```

## Run

```bash
npm start
```

> **Note:** If `npm start` exits immediately with `Cannot read properties of
> undefined (reading 'handle')`, the `ELECTRON_RUN_AS_NODE` environment variable
> is set, which forces Electron to run as plain Node.js (no GUI). Launch with it
> cleared:
> ```bash
> ELECTRON_RUN_AS_NODE= npm start
> ```

## Build a distributable

```bash
npm run dist     # packaged installer for the current platform
npm run package  # unpacked app directory only
```

## Project structure

```
src/
  main.js              Main process: app lifecycle, windows, IPC handlers
  preload.js           Secure bridge exposing a minimal API to the renderer
  renderer/
    index.html         App UI (with a strict Content-Security-Policy)
    renderer.js        Renderer logic (runs in the isolated page context)
    styles.css         Styles
```

## Security

The app follows Electron's recommended hardening defaults:

- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: true`
- A `contextBridge` preload exposes only an explicit, minimal API
- A restrictive `Content-Security-Policy` in `index.html`
