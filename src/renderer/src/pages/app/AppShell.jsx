import { useState, useEffect, useCallback } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { NAV_ITEMS, DIGIT_TO_ROUTE, EMERGENCY_CONTACT } from '../../lib/nav.js';
import { getCurrentUser, clearSession } from '../../lib/auth.js';
import MenuBar from './MenuBar.jsx';
import ShortcutsModal from './ShortcutsModal.jsx';

function shortName(fullName) {
  const parts = (fullName || 'Patient').trim().split(/\s+/);
  return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0];
}

export default function AppShell() {
  const navigate = useNavigate();
  const [showShortcuts, setShowShortcuts] = useState(false);
  const user = getCurrentUser();
  const userLabel = shortName(user?.name);

  const signOut = useCallback(() => {
    clearSession();
    navigate('/login');
  }, [navigate]);

  // Keyboard shortcuts: Ctrl/Cmd + 1..6 navigate; Ctrl/Cmd + / toggles help.
  useEffect(() => {
    const onKey = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === '/') {
        e.preventDefault();
        setShowShortcuts((s) => !s);
      } else if (DIGIT_TO_ROUTE[e.key]) {
        e.preventDefault();
        navigate(DIGIT_TO_ROUTE[e.key]);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navigate]);

  // Escape closes the shortcuts modal.
  useEffect(() => {
    if (!showShortcuts) return;
    const onEsc = (e) => e.key === 'Escape' && setShowShortcuts(false);
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [showShortcuts]);

  // Native-menu actions (Tools → Keyboard Shortcuts).
  useEffect(() => {
    if (!window.careconnect?.onMenuAction) return;
    return window.careconnect.onMenuAction((action) => {
      if (action === 'shortcuts') setShowShortcuts(true);
      if (action === 'signout') signOut();
    });
  }, [signOut]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="app-shell">
      <MenuBar userLabel={userLabel} onSignOut={signOut} onShowShortcuts={() => setShowShortcuts(true)} />

      {/* Toolbar tabs */}
      <div className="toolbar">
        <nav className="toolbar__tabs" aria-label="Sections">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `tab-btn ${isActive ? 'is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="toolbar__meta">
          <span className="toolbar__date">{today}</span>
          <span className="toolbar__sep">|</span>
          <span className="role-badge"><span className="role-badge__dot" /> {user?.role === 'caregiver' ? 'Caregiver' : 'Patient'}</span>
        </div>
      </div>

      {/* Sidebar + content */}
      <div className="shell-body">
        <aside className="sidebar">
          <p className="sidebar__label">Navigation</p>
          <nav className="sidebar__nav" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `side-link ${isActive ? 'is-active' : ''}`}
              >
                <span className="side-link__icon" aria-hidden="true">{item.icon}</span>
                <span className="side-link__label">{item.label}</span>
                <span className="side-link__kbd">{item.shortcut}</span>
              </NavLink>
            ))}
          </nav>

          <div className="emergency">
            <p className="emergency__title">📞 Emergency</p>
            <p className="emergency__name">{EMERGENCY_CONTACT.name}</p>
            <p className="emergency__phone">{EMERGENCY_CONTACT.phone}</p>
          </div>
        </aside>

        <main className="content">
          <Outlet />
        </main>
      </div>

      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </div>
  );
}
