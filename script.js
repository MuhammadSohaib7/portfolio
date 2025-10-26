// Smooth in-page nav, sticky nav, scrollspy, mobile menu, back-to-top, year
(function () {
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const nav = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');
    const backToTop = document.getElementById('backToTop');
  
    // Smooth scroll with offset for sticky header
    function scrollToId(id) {
      const el = document.querySelector(id);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  
    navLinks.forEach((a) => {
      a.addEventListener('click', (e) => {
        if (a.hash) {
          e.preventDefault();
          scrollToId(a.hash);
          // close mobile menu
          navLinksContainer.classList.remove('show');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  
    // Sticky shadow on scroll and back-to-top
    function onScroll() {
      const scrolled = window.scrollY > 6;
      nav.style.boxShadow = scrolled ? '0 6px 20px rgba(0,0,0,0.45)' : 'none';
      if (window.scrollY > 400) backToTop.classList.add('show'); else backToTop.classList.remove('show');
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
  
    // Scrollspy using IntersectionObserver
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove('active'));
          link && link.classList.add('active');
        }
        // animate in
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('[data-animate]').forEach((el) => el.classList.add('show'));
        }
      });
    }, { rootMargin: '-50% 0px -40% 0px', threshold: 0.01 });
    sections.forEach((sec) => observer.observe(sec));
  
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navLinksContainer.classList.toggle('show');
    });
  
    // Back to top
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  
    // Set current year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  })();