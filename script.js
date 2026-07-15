const contactCanvas = document.getElementById('contact-canvas');
const contactCtx = contactCanvas.getContext('2d');


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
      if (backToTop) {
        if (window.scrollY > 400) backToTop.classList.add('show'); else backToTop.classList.remove('show');
      }
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
    if (backToTop) {
      backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  
    // Set current year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  })();

  // ===== SKILLS BACKGROUND ANIMATION =====
const skillsCanvas = document.getElementById('skills-bg');
const skillsCtx = skillsCanvas.getContext('2d');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let skillsParticles = [];

// Canvas size set karna
function resizeSkillsCanvas() {
  const section = document.getElementById('skills');
  skillsCanvas.width = section.offsetWidth;
  skillsCanvas.height = section.offsetHeight;
}

resizeSkillsCanvas();
window.addEventListener('resize', resizeSkillsCanvas);

// Mouse track
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Particles create karna
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

// Lines draw karna between nearby particles
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

// Animation loop
function animateSkills() {
  skillsCtx.clearRect(0, 0, skillsCanvas.width, skillsCanvas.height);

  const section = document.getElementById('skills');
  const rect = section.getBoundingClientRect();
  const localMouseX = mouseX - rect.left;
  const localMouseY = mouseY - rect.top;

  skillsParticles.forEach(p => {

    // Mouse attract
    let dx = localMouseX - p.x;
    let dy = localMouseY - p.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 180) {
      p.x += dx * 0.015;
      p.y += dy * 0.015;
    }

    // Move
    p.x += p.speedX;
    p.y += p.speedY;

    // Bounce walls
    if (p.x < 0 || p.x > skillsCanvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > skillsCanvas.height) p.speedY *= -1;

    // Draw lines
    drawLines(p);

    // Draw particle
    skillsCtx.beginPath();
    skillsCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    skillsCtx.fillStyle = `rgba(255, 40, 40, ${p.opacity})`;
    skillsCtx.fill();

    // Mouse ke paas glow
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

// ===== PROJECT CARDS 3D TILT =====
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach(card => {
  const shine = card.querySelector('.card-shine');

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();

    // Mouse position card ke andar
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Center se distance
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Tilt angle calculate karna
    const rotateY = ((x - centerX) / centerX) * 12;
    const rotateX = -((y - centerY) / centerY) * 12;

    // 3D Tilt apply karna
    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale3d(1.03, 1.03, 1.03)
    `;

    // Shine position update karna
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;
    shine.style.background = `radial-gradient(
      circle at ${shineX}% ${shineY}%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 65%
    )`;
  });

  // Mouse leave - reset karna
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

// ===== CONTACT CANVAS ANIMATION =====
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

    // Lines between nearby particles
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

    // Draw particle
    contactCtx.beginPath();
    contactCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    contactCtx.fillStyle = `rgba(255, 40, 40, ${p.opacity})`;
    contactCtx.fill();
  });

  requestAnimationFrame(animateContact);
}

animateContact();

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

  // Fewer particles on small/mobile screens for smooth performance
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
      // ~10% particles are red (brand accent), rest are white/silver
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

      // gentle mouse repulsion
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

  // Skip on touch devices (no real mouse)
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

  // Grow ring on hoverable elements
  const hoverables = document.querySelectorAll('a, button, .btn, .nav-link, .card, input, textarea');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
  });
})();