export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (window.location.pathname === '/') {
    window.location.hash = '';
  }
}
