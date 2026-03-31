/* =========================================
   PURENATURE OILS — main.js
   ========================================= */

// ---- NAVBAR: scroll effect + hamburger ----
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  // animate hamburger lines
  const spans = hamburger.querySelectorAll('span');
  if (navMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close menu on link click
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ---- STATS: count-up animation ----
const counters = document.querySelectorAll('.stat-item h3[data-count]');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.getAttribute('data-count');
      const duration = 1600;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current).toLocaleString();
      }, 16);
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => countObserver.observe(c));

// ---- SCROLL REVEAL ----
const revealEls = document.querySelectorAll('.reveal-section');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// ---- TESTIMONIALS: auto-carousel ----
const track  = document.getElementById('testiTrack');
const dotsWrap = document.getElementById('testiDots');
const cards  = track ? track.querySelectorAll('.testi-card') : [];

if (cards.length && dotsWrap) {
  let current = 0;
  let perView = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
  const total = cards.length;

  // Build dots
  const numSlides = Math.ceil(total / perView);
  for (let i = 0; i < numSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  }

  function goTo(idx) {
    current = idx;
    const cardW = cards[0].offsetWidth + 24; // card width + gap
    track.style.transform = `translateX(-${current * cardW * perView}px)`;
    dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  // Auto-advance
  let autoplay = setInterval(() => {
    const next = (current + 1) % numSlides;
    goTo(next);
  }, 4000);

  track.closest('.testi-track-wrap').addEventListener('mouseenter', () => clearInterval(autoplay));
  track.closest('.testi-track-wrap').addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goTo((current + 1) % numSlides), 4000);
  });

  // Handle resize
  window.addEventListener('resize', () => {
    perView = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
    goTo(0);
  });
}

// ---- SMOOTH SCROLL for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = document.getElementById('navbar')?.offsetHeight || 72;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});
