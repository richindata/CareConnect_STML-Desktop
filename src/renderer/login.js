// Renderer logic for the Patient Sign In page. Demo-only credentials:
//   PIN      -> 1234
//   Password -> margaret@memory.care / caregiver
const DEMO_PIN = '1234';
const DEMO_EMAIL = 'margaret@memory.care';
const DEMO_PASSWORD = 'caregiver';

document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  setupPin();
  setupPassword();
});

/* ------------------------------ Tabs ------------------------------ */
function setupTabs() {
  const tabs = document.querySelectorAll('.tab');

  function activate(target) {
    tabs.forEach((t) => {
      const active = t.dataset.target === target;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    document.querySelectorAll('.panel').forEach((panel) => {
      const show = panel.id === `panel-${target}`;
      panel.classList.toggle('is-active', show);
      panel.hidden = !show;
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab.dataset.target));
  });

  // Deep-link support: login.html#password opens the password tab directly.
  if (window.location.hash === '#password') activate('password');
}

/* ------------------------------ PIN ------------------------------ */
function setupPin() {
  let entry = '';
  const dots = Array.from(document.querySelectorAll('#pin-dots .dot'));
  const status = document.getElementById('pin-status');
  const maxLen = dots.length;

  function render() {
    dots.forEach((dot, i) => dot.classList.toggle('is-filled', i < entry.length));
  }

  function setStatus(message, kind) {
    status.textContent = message || '';
    status.classList.toggle('is-error', kind === 'error');
    status.classList.toggle('is-ok', kind === 'ok');
  }

  function add(digit) {
    if (entry.length >= maxLen) return;
    setStatus('');
    entry += digit;
    render();
    if (entry.length === maxLen) submit();
  }

  function del() {
    setStatus('');
    entry = entry.slice(0, -1);
    render();
  }

  function submit() {
    if (entry === DEMO_PIN) {
      setStatus('PIN accepted. Signing in…', 'ok');
      window.setTimeout(() => {
        window.location.href = 'index.html';
      }, 700);
    } else {
      setStatus('Incorrect PIN. Please try again.', 'error');
      entry = '';
      window.setTimeout(render, 400);
    }
  }

  document.querySelectorAll('.key[data-digit]').forEach((key) => {
    key.addEventListener('click', () => add(key.dataset.digit));
  });
  document.getElementById('pin-del').addEventListener('click', del);

  // Allow physical keyboard while the PIN panel is visible.
  document.addEventListener('keydown', (event) => {
    if (document.getElementById('panel-pin').hidden) return;
    if (event.key >= '0' && event.key <= '9') add(event.key);
    else if (event.key === 'Backspace') del();
  });
}

/* ---------------------------- Password ---------------------------- */
function setupPassword() {
  const form = document.getElementById('password-form');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const alertBox = document.getElementById('login-alert');
  const alertText = document.getElementById('login-alert-text');
  const toggle = document.getElementById('toggle-password');
  const toggleLabel = document.getElementById('toggle-label');

  toggle.addEventListener('click', () => {
    const show = password.type === 'password';
    password.type = show ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', show ? 'true' : 'false');
    toggleLabel.textContent = show ? 'Hide' : 'Show';
  });

  function showError(message) {
    alertText.textContent = message;
    alertBox.hidden = false;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    alertBox.hidden = true;

    if (!email.value.trim() || !password.value) {
      showError('Please enter both your email and password.');
      return;
    }
    if (email.value.trim().toLowerCase() === DEMO_EMAIL && password.value === DEMO_PASSWORD) {
      window.location.href = 'index.html';
    } else {
      showError('Incorrect email or password.');
    }
  });
}
