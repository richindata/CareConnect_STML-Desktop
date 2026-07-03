import { NAV_ITEMS } from '../../lib/nav.js';

const EXTRA = [
  { label: 'Show this help', shortcut: 'Ctrl+/' },
  { label: 'Reload', shortcut: 'Ctrl+R' },
  { label: 'Toggle full screen', shortcut: 'F11 / ⌃⌘F' },
  { label: 'Zoom in / out', shortcut: 'Ctrl + / Ctrl −' },
];

// Accessible keyboard-shortcuts overlay (common desktop pattern).
export default function ShortcutsModal({ onClose }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="sc-title" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <h2 id="sc-title">Keyboard Shortcuts</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal__body">
          <h3 className="modal__section">Navigation</h3>
          <ul className="sc-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <span>{item.label}</span>
                <kbd>{item.shortcut}</kbd>
              </li>
            ))}
          </ul>
          <h3 className="modal__section">General</h3>
          <ul className="sc-list">
            {EXTRA.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                <kbd>{item.shortcut}</kbd>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
