// Lightweight, client-side account store for the demo app. Accounts created via
// the Create Account screen are persisted in localStorage so they can be used
// to sign in later. A built-in demo account always works.
//
// NOTE: This is a front-end-only demo store. Passwords are kept in plain text in
// localStorage — do not use this pattern for real credentials.
const STORAGE_KEY = 'careconnect.accounts';
const SESSION_KEY = 'careconnect.session';
const MODE_KEY = 'careconnect.mode';

const DEMO_ACCOUNT = {
  name: 'Margaret Hughes',
  email: 'margaret@memory.care',
  password: 'caregiver',
  role: 'patient',
  pin: '1234',
};

export const DEMO_EMAIL = DEMO_ACCOUNT.email;

function readAccounts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function findAccount(email) {
  const target = normalizeEmail(email);
  if (target === DEMO_ACCOUNT.email) return DEMO_ACCOUNT;
  return readAccounts().find((a) => normalizeEmail(a.email) === target) || null;
}

/**
 * Create and persist a new account.
 * @returns {{ ok: true } | { ok: false, error: string }}
 */
export function createAccount({ name, email, password, role }) {
  if (findAccount(email)) {
    return { ok: false, error: 'An account with this email already exists.' };
  }
  const accounts = readAccounts();
  accounts.push({
    name: name.trim(),
    email: normalizeEmail(email),
    password,
    role,
    createdAt: new Date().toISOString(),
  });
  writeAccounts(accounts);
  return { ok: true };
}

/**
 * Reset the password for an existing account (forgot-password flow).
 * @returns {{ ok: true } | { ok: false, error: string }}
 */
export function updatePassword(email, newPassword) {
  const target = normalizeEmail(email);

  // The demo account lives in code, not localStorage — update it in memory so
  // the new password works for the rest of the session.
  if (target === DEMO_ACCOUNT.email) {
    DEMO_ACCOUNT.password = newPassword;
    return { ok: true };
  }

  const accounts = readAccounts();
  const idx = accounts.findIndex((a) => normalizeEmail(a.email) === target);
  if (idx === -1) {
    return { ok: false, error: 'No account found with that email address.' };
  }
  accounts[idx] = { ...accounts[idx], password: newPassword };
  writeAccounts(accounts);
  return { ok: true };
}

/** Verify email + password against the demo account or a stored account. */
export function verifyPassword(email, password) {
  const account = findAccount(email);
  return !!account && account.password === password;
}

/** Verify a PIN. Only the demo account has a PIN in this demo. */
export function verifyPin(pin) {
  return pin === DEMO_ACCOUNT.pin;
}

/* --------------------------- Session handling --------------------------- */
// The "current user" is tracked so the dashboard can greet them and the
// Sign Out action can clear it.
export function setSession(email) {
  localStorage.setItem(SESSION_KEY, normalizeEmail(email));
}

export function getSession() {
  return localStorage.getItem(SESSION_KEY);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(MODE_KEY);
}

// Login "mode" decides which Home dashboard is shown: PIN login → patient view,
// Password login → caregiver view.
export function setMode(mode) {
  localStorage.setItem(MODE_KEY, mode);
}

export function getMode() {
  return localStorage.getItem(MODE_KEY) || 'patient';
}

export function getCurrentUser() {
  const email = getSession();
  return email ? findAccount(email) : null;
}

/** Sign in with a PIN (demo account only) and open a patient session. */
export function signInWithPin(pin) {
  if (!verifyPin(pin)) return false;
  setSession(DEMO_ACCOUNT.email);
  setMode('patient');
  return true;
}

/** Sign in with email + password and open a caregiver session. */
export function signInWithPassword(email, password) {
  if (!verifyPassword(email, password)) return false;
  setSession(email);
  setMode('caregiver');
  return true;
}
