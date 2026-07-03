// Single source of truth for the authenticated app's navigation. Used by the
// toolbar tabs, the sidebar, the native menu and the keyboard shortcuts so they
// always stay in sync ("dual entry points to every screen").
export const NAV_ITEMS = [
  { to: '/app', label: 'Home', icon: '🏠', shortcut: 'Ctrl+1', digit: '1', end: true },
  { to: '/app/daily-plan', label: 'Daily Plan', icon: '📅', shortcut: 'Ctrl+2', digit: '2' },
  { to: '/app/medications', label: 'Medications', icon: '💊', shortcut: 'Ctrl+3', digit: '3' },
  { to: '/app/reminders', label: 'Reminders', icon: '🔔', shortcut: 'Ctrl+4', digit: '4' },
  { to: '/app/journal', label: 'Journal', icon: '📖', shortcut: 'Ctrl+5', digit: '5' },
  { to: '/app/settings', label: 'Settings', icon: '⚙️', shortcut: 'Ctrl+6', digit: '6' },
];

// Map a pressed digit (1-6) to its destination route.
export const DIGIT_TO_ROUTE = Object.fromEntries(
  NAV_ITEMS.map((item) => [item.digit, item.to])
);

export const EMERGENCY_CONTACT = {
  name: 'Linda Chen',
  phone: '(617) 555-0182',
};
