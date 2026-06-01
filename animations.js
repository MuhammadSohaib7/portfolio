(function () {
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealSections = document.querySelectorAll('.scroll-reveal-section');

  if (!revealSections.length) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealSections.forEach(function (section) {
      section.classList.add('is-visible');
    });
    return;
  }

  var revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px'
  });

  revealSections.forEach(function (section) {
    revealObserver.observe(section);
  });
})();
