// Runs in the isolated renderer context. The only privileged surface is the
// `careconnect` API exposed by preload.js. The landing page is static, so this
// just wires up smooth in-page anchor navigation defensively.
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
