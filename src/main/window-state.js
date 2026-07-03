// Common desktop pattern: remember the window's size and position between runs.
// Stored as JSON in the app's userData directory (no extra dependency needed).
import { app, screen } from 'electron';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const STATE_FILE = join(app.getPath('userData'), 'window-state.json');
const DEFAULTS = { width: 1280, height: 860 };

function isVisibleOnSomeDisplay(bounds) {
  return screen.getAllDisplays().some((display) => {
    const wa = display.workArea;
    return (
      bounds.x >= wa.x - 50 &&
      bounds.y >= wa.y - 50 &&
      bounds.x + bounds.width <= wa.x + wa.width + 50 &&
      bounds.y + bounds.height <= wa.y + wa.height + 50
    );
  });
}

export function getWindowState() {
  if (!existsSync(STATE_FILE)) return { ...DEFAULTS };
  try {
    const saved = JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
    if (
      typeof saved.width === 'number' &&
      typeof saved.height === 'number' &&
      (saved.x === undefined || isVisibleOnSomeDisplay(saved))
    ) {
      return { ...DEFAULTS, ...saved };
    }
  } catch {
    // Corrupt or unreadable state — fall back to defaults.
  }
  return { ...DEFAULTS };
}

export function trackWindowState(win) {
  let timer = null;
  const save = () => {
    if (win.isDestroyed() || win.isMinimized() || win.isFullScreen()) return;
    try {
      writeFileSync(STATE_FILE, JSON.stringify(win.getBounds()));
    } catch {
      // Best-effort; ignore write failures.
    }
  };
  const debouncedSave = () => {
    clearTimeout(timer);
    timer = setTimeout(save, 400);
  };

  win.on('resize', debouncedSave);
  win.on('move', debouncedSave);
  win.on('close', save);
}
