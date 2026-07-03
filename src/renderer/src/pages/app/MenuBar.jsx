import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// In-app menu bar that visually matches the mockup (File / View / Tools / Help).
// The native Electron application menu mirrors these actions; this bar gives the
// same affordances inside the window on every platform.
export default function MenuBar({ userLabel, onSignOut, onShowShortcuts }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const barRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) setOpen(null);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const go = (to) => () => navigate(to);
  const openExternal = (url) => () => window.open(url, '_blank');

  const MENUS = {
    File: [
      { label: 'New Journal Entry', onClick: go('/app/journal') },
      { separator: true },
      { label: 'Sign Out', onClick: onSignOut },
    ],
    View: [
      { label: 'Home', hint: 'Ctrl+1', onClick: go('/app') },
      { label: 'Daily Plan', hint: 'Ctrl+2', onClick: go('/app/daily-plan') },
      { label: 'Medications', hint: 'Ctrl+3', onClick: go('/app/medications') },
      { label: 'Reminders', hint: 'Ctrl+4', onClick: go('/app/reminders') },
      { label: 'Journal', hint: 'Ctrl+5', onClick: go('/app/journal') },
      { label: 'Settings', hint: 'Ctrl+6', onClick: go('/app/settings') },
    ],
    Tools: [
      { label: 'Keyboard Shortcuts', hint: 'Ctrl+/', onClick: onShowShortcuts },
      { label: 'Settings', hint: 'Ctrl+6', onClick: go('/app/settings') },
    ],
    Help: [
      { label: 'About Care Connect', onClick: () => window.alert('Care Connect — a calm daily companion for people living with short-term memory loss.') },
      { label: 'Learn More', onClick: openExternal('https://www.electronjs.org') },
    ],
  };

  const handleItem = (item) => () => {
    setOpen(null);
    item.onClick?.();
  };

  return (
    <header className="menubar" ref={barRef}>
      <div className="menubar__brand">
        <span className="menubar__logo" aria-hidden="true">◉</span>
        <span className="menubar__name">Care Connect</span>
      </div>

      <nav className="menubar__menus" aria-label="Application menu">
        {Object.keys(MENUS).map((name) => (
          <div className="menu" key={name}>
            <button
              className={`menu__label ${open === name ? 'is-open' : ''}`}
              onClick={() => setOpen(open === name ? null : name)}
              onMouseEnter={() => open && setOpen(name)}
            >
              {name}
            </button>
            {open === name && (
              <ul className="menu__dropdown" role="menu">
                {MENUS[name].map((item, i) =>
                  item.separator ? (
                    <li key={i} className="menu__sep" role="separator" />
                  ) : (
                    <li key={i} role="none">
                      <button className="menu__item" role="menuitem" onClick={handleItem(item)}>
                        <span>{item.label}</span>
                        {item.hint && <span className="menu__hint">{item.hint}</span>}
                      </button>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        ))}
      </nav>

      <div className="menubar__right">
        <button className="menubar__kbd" onClick={onShowShortcuts} title="Keyboard shortcuts (Ctrl+/)">
          ⌨ <span className="kbd-badge">Ctrl+/</span>
        </button>
        <span className="menubar__user">
          <span aria-hidden="true">👤</span> {userLabel}
        </span>
        <button className="menubar__signout" onClick={onSignOut}>
          <span aria-hidden="true">⤴</span> Sign out
        </button>
      </div>
    </header>
  );
}
