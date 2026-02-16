// Smooth scroll for nav links (anchor behavior is already smooth via CSS)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Optional: subtle header background on scroll
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => {
    header.style.background = window.scrollY > 80
      ? 'rgba(26, 18, 11, 0.98)'
      : 'linear-gradient(to bottom, rgba(26,18,11,0.95), transparent)';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}
