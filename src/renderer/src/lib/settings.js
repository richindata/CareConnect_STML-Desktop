// User preferences store. Front-end-only demo (unencrypted localStorage). The
// display preferences (font size, high contrast) are applied globally so they
// take effect on every screen, not just the Settings page.
const SETTINGS_KEY = 'careconnect.settings';

export const DEFAULT_SETTINGS = {
  fontSize: 17, // px — base font size, range 14–24
  highContrast: false,
  largePinPad: true,
  reminderSounds: true,
};

export const FONT_MIN = 14;
export const FONT_MAX = 24;

export function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    if (s && typeof s === 'object') return { ...DEFAULT_SETTINGS, ...s };
  } catch {
    /* ignore malformed storage */
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

/**
 * Apply display preferences to the document. Font size scales rem-based sizing
 * across the whole app; high contrast swaps in bolder ink/line colours via a
 * root class. Safe to call on every app load and on every change (live preview).
 */
export function applySettings(settings) {
  const root = document.documentElement;
  root.style.fontSize = `${settings.fontSize}px`;
  root.classList.toggle('cc-contrast', !!settings.highContrast);
}
