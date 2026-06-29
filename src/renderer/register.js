// Renderer logic for the Create Account page. Demo-only: no real backend, the
// form validates locally and then sends the user back to the sign-in screen.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirm = document.getElementById('confirm');
  const terms = document.getElementById('terms');

  const alertBox = document.getElementById('register-alert');
  const alertText = document.getElementById('register-alert-text');
  const success = document.getElementById('register-success');

  const toggle = document.getElementById('toggle-password');
  const toggleLabel = document.getElementById('toggle-label');

  toggle.addEventListener('click', () => {
    const show = password.type === 'password';
    password.type = show ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', show ? 'true' : 'false');
    toggleLabel.textContent = show ? 'Hide' : 'Show';
  });

  function showError(message) {
    success.hidden = true;
    alertText.textContent = message;
    alertBox.hidden = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    alertBox.hidden = true;

    if (!name.value.trim()) return showError('Please enter your full name.');
    if (!emailPattern.test(email.value.trim())) return showError('Please enter a valid email address.');
    if (password.value.length < 8) return showError('Password must be at least 8 characters.');
    if (password.value !== confirm.value) return showError('Passwords do not match.');
    if (!terms.checked) return showError('Please accept the Terms of Service to continue.');

    // Success (demo): show confirmation, then return to the sign-in screen.
    alertBox.hidden = true;
    success.hidden = false;
    window.setTimeout(() => {
      window.location.href = 'login.html#password';
    }, 1200);
  });
});
