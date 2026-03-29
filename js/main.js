/* =============================================
   PURENATURE OILS – main.js
   ============================================= */

"use strict";

/* =============================================
   1. NAVBAR – scroll + hamburger
   ============================================= */
const navbar    = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navMenu   = document.getElementById("navMenu");
const navLinks  = document.querySelectorAll(".nav-link");

// Scroll: add .scrolled
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

// Hamburger toggle
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navMenu.classList.toggle("open");
  document.body.style.overflow = navMenu.classList.contains("open") ? "hidden" : "";
});

// Close menu on link click
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navMenu.classList.remove("open");
    document.body.style.overflow = "";
  });
});

/* =============================================
   2. HERO PARALLAX – scroll + mouse
   ============================================= */
const heroVideo   = document.getElementById("heroVideo");
const heroContent = document.getElementById("heroContent");

let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let scrollY = 0;

// Capture mouse
document.addEventListener("mousemove", e => {
  mouseX = (e.clientX / window.innerWidth  - 0.5) * 14;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 14;
}, { passive: true });

// Capture scroll
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
}, { passive: true });

// Animation loop
(function animLoop() {
  // Lerp mouse
  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;

  const scale   = 1 + scrollY * 0.0004;
  const moveY   = scrollY * 0.25;

  if (heroVideo) {
    heroVideo.style.transform =
      `scale(${scale}) translate(${targetX * 0.5}px, ${targetY * 0.5}px)`;
  }
  if (heroContent) {
    heroContent.style.transform =
      `translate(-50%, calc(-50% + ${moveY}px))`;
    heroContent.style.left = "50%";
    heroContent.style.top  = "50%";
    heroContent.style.position = "absolute";
  }

  requestAnimationFrame(animLoop);
})();

/* =============================================
   3. PARTICLES
   ============================================= */
const particlesWrap = document.getElementById("heroParticles");

if (particlesWrap) {
  const count = window.innerWidth < 600 ? 10 : 20;
  for (let i = 0; i < count; i++) {
    const p   = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 5 + 2;
    const dur  = Math.random() * 12 + 8;
    const del  = Math.random() * 10;
    const left = Math.random() * 100;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${left}%;
      animation-duration: ${dur}s;
      animation-delay: ${del}s;
      opacity: 0;
    `;
    particlesWrap.appendChild(p);
  }
}

/* =============================================
   4. COUNTER ANIMATION
   ============================================= */
function animateCount(el, target, duration = 1800) {
  const start = performance.now();
  const update = (time) => {
    const elapsed  = time - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.floor(eased * target);
    // keep the <span>+ intact
    const span = el.querySelector("span");
    el.innerHTML = current.toLocaleString();
    if (span) el.appendChild(span);
    else {
      const s = document.createElement("span");
      s.textContent = "+";
      el.appendChild(s);
    }
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/* =============================================
   5. INTERSECTION OBSERVER
   ============================================= */
const revealEls = document.querySelectorAll(".reveal");
const statItems = document.querySelectorAll(".stat-item");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// Stats counter observer
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const item   = entry.target;
      const target = parseInt(item.dataset.count, 10);
      const numEl  = item.querySelector(".stat-num");
      if (numEl) animateCount(numEl, target);
      statObserver.unobserve(item);
    }
  });
}, { threshold: 0.3 });

statItems.forEach(el => statObserver.observe(el));

/* =============================================
   6. TESTIMONIALS MOBILE SLIDER
   ============================================= */
const testiTrack = document.getElementById("testiTrack");
const testiDots  = document.getElementById("testiDots");
const testiCards = testiTrack ? testiTrack.querySelectorAll(".testi-card") : [];

let currentSlide = 0;

function isMobile() {
  return window.innerWidth <= 768;
}

function buildDots() {
  if (!testiDots) return;
  testiDots.innerHTML = "";
  testiCards.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "testi-dot" + (i === currentSlide ? " active" : "");
    d.addEventListener("click", () => goToSlide(i));
    testiDots.appendChild(d);
  });
}

function goToSlide(index) {
  if (!isMobile()) return;
  currentSlide = index;
  testiCards.forEach((c, i) => c.classList.toggle("active", i === index));
  document.querySelectorAll(".testi-dot").forEach((d, i) =>
    d.classList.toggle("active", i === index)
  );
}

function initSlider() {
  if (!testiTrack) return;
  if (isMobile()) {
    goToSlide(0);
    buildDots();
  } else {
    // Desktop: show all
    testiCards.forEach(c => c.style.display = "");
    testiCards.forEach(c => c.classList.remove("active"));
    if (testiDots) testiDots.innerHTML = "";
  }
}

window.addEventListener("resize", initSlider);
initSlider();

// Touch/swipe support
let touchStartX = 0;
if (testiTrack) {
  testiTrack.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  testiTrack.addEventListener("touchend", e => {
    if (!isMobile()) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 40) return;
    if (dx < 0 && currentSlide < testiCards.length - 1) goToSlide(currentSlide + 1);
    if (dx > 0 && currentSlide > 0) goToSlide(currentSlide - 1);
  }, { passive: true });
}

/* =============================================
   7. CONTACT FORM
   ============================================= */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    const btn = contactForm.querySelector("button[type=submit]");
    const originalText = btn.textContent;
    btn.textContent = "Sending…";
    btn.disabled = true;

    // Simulate async (replace with real fetch)
    setTimeout(() => {
      btn.textContent = "✓ Message Sent!";
      btn.style.background = "#2d8a4e";
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "";
        btn.disabled = false;
      }, 3000);
    }, 1200);
  });
}

/* =============================================
   8. SMOOTH ACTIVE NAV HIGHLIGHT ON SCROLL
   ============================================= */
const sections = document.querySelectorAll("section[id], header[id]");

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute("id");
      navLinks.forEach(link => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${id}`
        );
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
