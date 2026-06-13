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