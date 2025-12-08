// Animation au scroll pour la biographie
function initBiographyAnimations() {
  const animatedElements = document.querySelectorAll('.animate');
  if (!animatedElements || animatedElements.length === 0) return;

  try {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      animatedElements.forEach(el => observer.observe(el));
    } else {
      // Fallback: reveal everything if IntersectionObserver is not supported
      animatedElements.forEach(el => el.classList.add('visible'));
    }
  } catch (err) {
    // On any error, reveal elements so the page remains usable
    console.warn('Animation observer failed:', err);
    animatedElements.forEach(el => el.classList.add('visible'));
  }
}

// Run now if DOM is already ready, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBiographyAnimations);
} else {
  initBiographyAnimations();
}
