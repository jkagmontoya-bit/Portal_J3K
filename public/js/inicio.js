// Scroll progress bar
const progress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progress.style.width = pct + '%';
});

// Nav background on scroll
const nav = document.getElementById('mainNav');
const heroBg = document.getElementById('heroBgImg');
window.addEventListener('scroll', () => {
  if(window.scrollY > 40){ nav.classList.add('scrolled'); } else { nav.classList.remove('scrolled'); }
});

// Hero bg image fade-in
window.addEventListener('load', () => {
  setTimeout(()=>{ heroBg.style.transition = 'opacity 1.4s ease'; heroBg.style.opacity = '1'; }, 300);
});

// Mobile nav toggle + navegación funcional
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Navegación de botones: Nosotros / Equipo / Servicios / Proyectos / Clientes / Contáctanos
navAnchors.forEach(anchor => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');
    const target = document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();
    navLinks.classList.remove('open');

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    navAnchors.forEach(a => a.classList.remove('active'));
    anchor.classList.add('active');

    if (history && history.replaceState) {
      history.replaceState(null, '', targetId);
    }
  });
});

// Active link highlighting
const sections = document.querySelectorAll('section[id]');
const obs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      navAnchors.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if(match) match.classList.add('active');
    }
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0.05 });
sections.forEach(s => obs.observe(s));

// Reveal-on-scroll
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){ entry.target.classList.add('in'); revealObs.unobserve(entry.target); }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));