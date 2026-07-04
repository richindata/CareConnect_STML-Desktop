import { useState, useEffect, useCallback } from 'react';
import {
  loadSettings,
  saveSettings,
  applySettings,
  DEFAULT_SETTINGS,
  FONT_MIN,
  FONT_MAX,
} from '../../lib/settings.js';
import { getCurrentUser } from '../../lib/auth.js';

const CARE_TEAM = { doctor: 'Dr. Sarah Chen', caregiver: 'Linda Chen', mrn: 'MRN-00421' };

// Keyboard reference grid (left column, right column). Reflects the real
// bindings the app registers, so it stays truthful.
const SHORTCUTS = [
  ['Home', 'Ctrl+1', 'Daily Plan', 'Ctrl+2'],
  ['Medications', 'Ctrl+3', 'Reminders', 'Ctrl+4'],
  ['Journal', 'Ctrl+5', 'Settings', 'Ctrl+6'],
  ['New', 'Ctrl+N', 'Save', 'Ctrl+S'],
  ['Shortcuts', 'Ctrl+/', 'Help', 'F1'],
  ['Emergency', 'F9', '', ''],
];

const TOGGLES = [
  { key: 'highContrast', label: 'High contrast mode', hint: 'Increases contrast for easier reading' },
  { key: 'largePinPad', label: 'Large PIN keypad', hint: 'Oversized numbers on PIN login' },
  { key: 'reminderSounds', label: 'Reminder sounds', hint: 'Gentle chime with notifications' },
];

/**
 * Settings — display, accessibility and account preferences. Reached from the
 * sidebar, the toolbar tabs and the native View → Settings menu (all route to
 * /app/settings, also Ctrl/Cmd+6). Display preferences preview live; Ctrl+S /
 * Save Settings persists, Reset to Defaults restores them.
 */
export default function Settings() {
  const user = getCurrentUser();
  const [settings, setSettings] = useState(loadSettings);
  const [savedFlash, setSavedFlash] = useState(false);

  // Live preview: apply whenever a control changes.
  useEffect(() => {
    applySettings(settings);
  }, [settings]);

  const update = (patch) => {
    setSettings((s) => ({ ...s, ...patch }));
    setSavedFlash(false);
  };

  const save = useCallback(() => {
    saveSettings(settings);
    applySettings(settings);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  }, [settings]);

  const reset = () => {
    setSettings({ ...DEFAULT_SETTINGS });
    saveSettings(DEFAULT_SETTINGS);
    applySettings(DEFAULT_SETTINGS);
    setSavedFlash(false);
  };

  // Ctrl/Cmd+S saves settings.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        save();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [save]);

  const pct = ((settings.fontSize - FONT_MIN) / (FONT_MAX - FONT_MIN)) * 100;

  return (
    <div className="settings">
      <header className="page-head">
        <div>
          <h1 className="page-head__title">Settings</h1>
          <p className="page-head__sub">Display, accessibility, and account preferences.</p>
        </div>
      </header>

      <div className="set-cols">
        {/* Accessibility */}
        <section className="set-panel">
          <p className="set-panel__label">Accessibility</p>
          <div className="set-panel__body">
            <div className="set-item set-item--slider">
              <div className="set-slider__top">
                <span className="set-item__label">Base font size</span>
                <span className="set-slider__value">{settings.fontSize}px</span>
              </div>
              <input
                type="range"
                min={FONT_MIN}
                max={FONT_MAX}
                value={settings.fontSize}
                onChange={(e) => update({ fontSize: Number(e.target.value) })}
                className="set-slider"
                style={{ '--pct': `${pct}%` }}
                aria-label="Base font size"
              />
              <div className="set-slider__scale">
                <span>{FONT_MIN}px</span>
                <span>{FONT_MAX}px</span>
              </div>
            </div>

            {TOGGLES.map((t) => (
              <div className="set-item" key={t.key}>
                <div>
                  <p className="set-item__label">{t.label}</p>
                  <p className="set-item__hint">{t.hint}</p>
                </div>
                <button
                  type="button"
                  className={`switch ${settings[t.key] ? 'is-on' : ''}`}
                  role="switch"
                  aria-checked={settings[t.key]}
                  aria-label={t.label}
                  onClick={() => update({ [t.key]: !settings[t.key] })}
                >
                  <span className="switch__knob" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Keyboard shortcuts reference */}
        <section className="set-panel">
          <p className="set-panel__label">Keyboard Shortcuts</p>
          <div className="set-panel__body">
            <div className="sc-grid">
              {SHORTCUTS.flatMap((row, i) => [
                <ShortcutCell key={`${i}a`} label={row[0]} keys={row[1]} />,
                <ShortcutCell key={`${i}b`} label={row[2]} keys={row[3]} />,
              ])}
            </div>
          </div>
        </section>
      </div>

      {/* Account */}
      <section className="set-panel">
        <p className="set-panel__label">Account</p>
        <div className="set-panel__body account-grid">
          <Field label="Name" value={user?.name || 'Margaret Holloway'} />
          <Field label="Email" value={user?.email || 'margaret@memory.care'} />
          <Field label="Care Team" value={CARE_TEAM.doctor} />
          <Field label="Caregiver" value={CARE_TEAM.caregiver} />
          <Field label="Patient ID" value={CARE_TEAM.mrn} />
        </div>
      </section>

      <div className="set-actions">
        <button className="hero-btn hero-btn--navy add-task-btn" onClick={save}>
          Save Settings <kbd className="kbd-hint">Ctrl+S</kbd>
        </button>
        <button className="task-form__cancel" onClick={reset}>Reset to Defaults</button>
        {savedFlash && <span className="set-saved" role="status">✓ Saved</span>}
      </div>
    </div>
  );
}

function ShortcutCell({ label, keys }) {
  if (!label) return <span className="sc-cell sc-cell--empty" aria-hidden="true" />;
  return (
    <div className="sc-cell">
      <span className="sc-cell__label">{label}</span>
      <kbd className="sc-cell__kbd">{keys}</kbd>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="acct-field">
      <p className="acct-field__label">{label}</p>
      <p className="acct-field__value">{value}</p>
    </div>
  );
}
