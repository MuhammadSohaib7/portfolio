// ===== HAMBURGER MENU (SINGLE VERSION) =====
(function () {
  function closeNavMenu(navLinks, navToggle) {
    navLinks.classList.remove('show');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-menu-open');
  }

  function setNavMenuOpen(navLinks, navToggle, open) {
    navLinks.classList.toggle('show', open);
    navToggle.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('nav-menu-open', open);
  }

  function initNavMenu() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-link');

    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      setNavMenuOpen(navLinks, navToggle, !navLinks.classList.contains('show'));
    });

    const isCoarseTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    navItems.forEach((link) => {
      function goToPage(href) {
        closeNavMenu(navLinks, navToggle);
        window.location.href = href;
      }

      link.addEventListener('click', function (e) {
        e.stopPropagation();
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && isCoarseTouch) {
          e.preventDefault();
          goToPage(href);
          return;
        }
        closeNavMenu(navLinks, navToggle);
      });

      /* Spline/canvas layers can steal taps on mobile; explicit navigation on touch */
      if (isCoarseTouch) {
        link.addEventListener(
          'touchend',
          function (e) {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#')) return;
            e.preventDefault();
            e.stopPropagation();
            goToPage(href);
          },
          { passive: false }
        );
      }
    });

    document.addEventListener('click', function (e) {
      if (!navLinks.classList.contains('show')) return;
      if (e.target.closest('#navLinks') || e.target.closest('#navToggle')) return;
      closeNavMenu(navLinks, navToggle);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNavMenu(navLinks, navToggle);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavMenu);
  } else {
    initNavMenu();
  }
})();

// ===== SMOOTH SCROLL WITH OFFSET =====
(function () {
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  
  function scrollToId(id) {
    const el = document.querySelector(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 70;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  navLinks.forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        scrollToId(href);
      }
    });
  });
})();

// ===== STICKY SHADOW ON SCROLL AND BACK-TO-TOP =====
(function () {
  const nav = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const scrolled = window.scrollY > 6;
    if (nav) {
      nav.style.boxShadow = scrolled ? '0 6px 20px rgba(0,0,0,0.45)' : 'none';
    }
    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }
  }
  
  window.addEventListener('scroll', onScroll);
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();

// ===== SCROLLSPY =====
(function () {
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = document.querySelectorAll('section[id]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove('active'));
        link && link.classList.add('active');
      }

      // Animate in
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-animate]').forEach((el) => el.classList.add('show'));
      }
    });
  }, { rootMargin: '-50% 0px -40% 0px', threshold: 0.01 });

  sections.forEach((sec) => observer.observe(sec));
})();

// ===== YEAR UPDATE =====
(function () {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();

// ===== SKILLS BACKGROUND ANIMATION =====
(function () {
  const skillsCanvas = document.getElementById('skills-bg');
  if (!skillsCanvas) return;
  
  const skillsCtx = skillsCanvas.getContext('2d');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let skillsParticles = [];

  function resizeSkillsCanvas() {
    const section = document.getElementById('skills');
    if (!section) return;
    skillsCanvas.width = section.offsetWidth;
    skillsCanvas.height = section.offsetHeight;
  }

  resizeSkillsCanvas();
  window.addEventListener('resize', resizeSkillsCanvas);

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function createParticles() {
    skillsParticles = [];
    for (let i = 0; i < 100; i++) {
      skillsParticles.push({
        x: Math.random() * skillsCanvas.width,
        y: Math.random() * skillsCanvas.height,
        size: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 1.2,
        speedY: (Math.random() - 0.5) * 1.2,
        opacity: Math.random() * 0.6 + 0.2,
      });
    }
  }

  createParticles();

  function drawLines(p1) {
    skillsParticles.forEach(p2 => {
      let dx = p1.x - p2.x;
      let dy = p1.y - p2.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        skillsCtx.beginPath();
        skillsCtx.moveTo(p1.x, p1.y);
        skillsCtx.lineTo(p2.x, p2.y);
        skillsCtx.strokeStyle = `rgba(255, 0, 0, ${0.15 * (1 - dist / 120)})`;
        skillsCtx.lineWidth = 0.5;
        skillsCtx.stroke();
      }
    });
  }

  function animateSkills() {
    skillsCtx.clearRect(0, 0, skillsCanvas.width, skillsCanvas.height);

    const section = document.getElementById('skills');
    const rect = section.getBoundingClientRect();
    const localMouseX = mouseX - rect.left;
    const localMouseY = mouseY - rect.top;

    skillsParticles.forEach(p => {
      let dx = localMouseX - p.x;
      let dy = localMouseY - p.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 180) {
        p.x += dx * 0.015;
        p.y += dy * 0.015;
      }

      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0 || p.x > skillsCanvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > skillsCanvas.height) p.speedY *= -1;

      drawLines(p);

      skillsCtx.beginPath();
      skillsCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      skillsCtx.fillStyle = `rgba(255, 40, 40, ${p.opacity})`;
      skillsCtx.fill();

      if (dist < 100) {
        skillsCtx.beginPath();
        skillsCtx.arc(p.x, p.y, p.size + 2, 0, Math.PI * 2);
        skillsCtx.fillStyle = `rgba(255, 80, 80, 0.15)`;
        skillsCtx.fill();
      }
    });
    requestAnimationFrame(animateSkills);
  }

  animateSkills();
})();

// ===== PROJECT CARDS 3D TILT =====
(function () {
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    const shine = card.querySelector('.card-shine');
    if (!shine) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * 12;
      const rotateX = -((y - centerY) / centerY) * 12;

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(1.03, 1.03, 1.03)
      `;

      const shineX = (x / rect.width) * 100;
      const shineY = (y / rect.height) * 100;
      shine.style.background = `radial-gradient(
        circle at ${shineX}% ${shineY}%,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 65%
      )`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `
        perspective(1000px)
        rotateX(0deg)
        rotateY(0deg)
        scale3d(1, 1, 1)
      `;
      shine.style.background = '';
    });
  });
})();

// ===== CONTACT CANVAS ANIMATION =====
(function () {
  const contactCanvas = document.getElementById('contact-canvas');
  if (!contactCanvas) return;
  
  const contactCtx = contactCanvas.getContext('2d');

  function resizeContactCanvas() {
    contactCanvas.width = contactCanvas.offsetWidth;
    contactCanvas.height = contactCanvas.offsetHeight;
  }
  
  resizeContactCanvas();
  window.addEventListener('resize', resizeContactCanvas);

  let contactParticles = [];

  for (let i = 0; i < 60; i++) {
    contactParticles.push({
      x: Math.random() * contactCanvas.width,
      y: Math.random() * contactCanvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 1,
      speedY: (Math.random() - 0.5) * 1,
      opacity: Math.random() * 0.5 + 0.2,
    });
  }

  function animateContact() {
    resizeContactCanvas();
    contactCtx.clearRect(0, 0, contactCanvas.width, contactCanvas.height);

    contactParticles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0 || p.x > contactCanvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > contactCanvas.height) p.speedY *= -1;

      contactParticles.forEach(p2 => {
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          contactCtx.beginPath();
          contactCtx.moveTo(p.x, p.y);
          contactCtx.lineTo(p2.x, p2.y);
          contactCtx.strokeStyle = `rgba(255, 0, 0, ${0.15 * (1 - dist / 100)})`;
          contactCtx.lineWidth = 0.5;
          contactCtx.stroke();
        }
      });

      contactCtx.beginPath();
      contactCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      contactCtx.fillStyle = `rgba(255, 40, 40, ${p.opacity})`;
      contactCtx.fill();
    });

    requestAnimationFrame(animateContact);
  }

  animateContact();
})();

// ===== SITE-WIDE WAVY PARTICLE BACKGROUND =====
(function () {
  const bgCanvas = document.getElementById('bg-particles');
  if (!bgCanvas) return;
  
  const bgCtx = bgCanvas.getContext('2d');

  let bgW, bgH;
  function resizeBgCanvas() {
    bgW = bgCanvas.width = window.innerWidth;
    bgH = bgCanvas.height = window.innerHeight;
  }
  resizeBgCanvas();
  window.addEventListener('resize', resizeBgCanvas);

  const bgMouse = { x: bgW / 2, y: bgH / 2 };
  document.addEventListener('mousemove', (e) => {
    bgMouse.x = e.clientX;
    bgMouse.y = e.clientY;
  });

  const bgParticleCount = window.innerWidth < 768 ? 150 : 400;
  const bgParticles = [];

  class BgParticle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * bgW;
      this.y = Math.random() * bgH;
      this.baseY = this.y;
      this.speed = 0.3 + Math.random() * 0.5;
      this.angle = Math.random() * Math.PI * 2;
      this.amplitude = 15 + Math.random() * 35;
      this.size = 1 + Math.random() * 1.3;
      this.opacity = 0.25 + Math.random() * 0.4;
      this.isRed = Math.random() < 0.1;
    }
    update() {
      this.angle += 0.01;
      this.x += this.speed;
      this.y = this.baseY + Math.sin(this.angle) * this.amplitude;

      if (this.x > bgW + 20) {
        this.x = -20;
        this.baseY = Math.random() * bgH;
      }

      const dx = this.x - bgMouse.x;
      const dy = this.y - bgMouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        this.x += (dx / dist) * force * 3;
        this.y += (dy / dist) * force * 3;
      }
    }
    draw() {
      bgCtx.beginPath();
      bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      bgCtx.fillStyle = this.isRed
        ? `rgba(255, 0, 0, ${this.opacity})`
        : `rgba(255, 255, 255, ${this.opacity * 0.6})`;
      bgCtx.fill();
    }
  }

  for (let i = 0; i < bgParticleCount; i++) bgParticles.push(new BgParticle());

  function connectBgParticles() {
    for (let i = 0; i < bgParticles.length; i++) {
      for (let j = i + 1; j < bgParticles.length; j++) {
        const dx = bgParticles[i].x - bgParticles[j].x;
        const dy = bgParticles[i].y - bgParticles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 55) {
          bgCtx.beginPath();
          bgCtx.strokeStyle = `rgba(255, 255, 255, ${0.12 * (1 - dist / 55)})`;
          bgCtx.lineWidth = 0.5;
          bgCtx.moveTo(bgParticles[i].x, bgParticles[i].y);
          bgCtx.lineTo(bgParticles[j].x, bgParticles[j].y);
          bgCtx.stroke();
        }
      }
    }
  }

  function animateBg() {
    bgCtx.clearRect(0, 0, bgW, bgH);
    bgParticles.forEach(p => { p.update(); p.draw(); });
    connectBgParticles();
    requestAnimationFrame(animateBg);
  }
  animateBg();
})();

// ===== CUSTOM CURSOR =====
(function () {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  function animateCursorRing() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateCursorRing);
  }
  animateCursorRing();

  const hoverables = document.querySelectorAll('a, button, .btn, .nav-link, .card, input, textarea');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
  });
})();