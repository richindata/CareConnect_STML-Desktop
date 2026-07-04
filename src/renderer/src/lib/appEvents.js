// Tiny app-wide event bus for the context-sensitive "New" command. The native
// application menu (File → New, bridged in AppShell) and the in-window menu bar
// both emit it; whichever page is currently mounted decides what "New" means —
// Add Task on the Daily Plan, Add Medication on the Medications page, and so on.
// This keeps every "New" entry point (menu, menu bar, Ctrl/Cmd+N) pointed at a
// single per-page handler.
const NEW_EVENT = 'cc:new';

export function emitNew() {
  window.dispatchEvent(new CustomEvent(NEW_EVENT));
}

/** Subscribe to the "New" command. Returns an unsubscribe function. */
export function onNew(callback) {
  const handler = () => callback();
  window.addEventListener(NEW_EVENT, handler);
  return () => window.removeEventListener(NEW_EVENT, handler);
}
