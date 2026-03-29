/* ===== PURENATURE OILS – main.js ===== */
"use strict";

/* 1. NAVBAR */
var navbar    = document.getElementById("navbar");
var hamburger = document.getElementById("hamburger");
var navMenu   = document.getElementById("navMenu");
var navLinks  = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", function() {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

hamburger.addEventListener("click", function() {
  hamburger.classList.toggle("open");
  navMenu.classList.toggle("open");
  document.body.style.overflow = navMenu.classList.contains("open") ? "hidden" : "";
});

navLinks.forEach(function(link) {
  link.addEventListener("click", function() {
    hamburger.classList.remove("open");
    navMenu.classList.remove("open");
    document.body.style.overflow = "";
  });
});

/* 2. HERO PARALLAX */
var heroVideo   = document.getElementById("heroVideo");
var heroContent = document.getElementById("heroContent");
var mouseX = 0, mouseY = 0, targetX = 0, targetY = 0, scrollYPos = 0;

document.addEventListener("mousemove", function(e) {
  mouseX = (e.clientX / window.innerWidth  - 0.5) * 14;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 14;
}, { passive: true });

window.addEventListener("scroll", function() {
  scrollYPos = window.scrollY;
}, { passive: true });

(function animLoop() {
  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;
  var scale = 1 + scrollYPos * 0.0004;
  var moveY = scrollYPos * 0.25;
  if (heroVideo) {
    heroVideo.style.transform = "scale(" + scale + ") translate(" + (targetX * 0.5) + "px," + (targetY * 0.5) + "px)";
  }
  if (heroContent) {
    heroContent.style.top  = "50%";
    heroContent.style.left = "50%";
    heroContent.style.position = "absolute";
    heroContent.style.transform = "translate(-50%, calc(-50% + " + moveY + "px))";
  }
  requestAnimationFrame(animLoop);
})();

/* 3. PARTICLES */
var particlesWrap = document.getElementById("heroParticles");
if (particlesWrap) {
  var count = window.innerWidth < 600 ? 10 : 20;
  for (var i = 0; i < count; i++) {
    var p    = document.createElement("div");
    p.className = "particle";
    var size = Math.random() * 5 + 2;
    var dur  = Math.random() * 12 + 8;
    var del  = Math.random() * 10;
    var left = Math.random() * 100;
    p.style.cssText = "width:" + size + "px;height:" + size + "px;left:" + left + "%;animation-duration:" + dur + "s;animation-delay:" + del + "s;opacity:0;";
    particlesWrap.appendChild(p);
  }
}

/* 4. COUNTER */
function animateCount(el, target) {
  var duration = 1800;
  var start = performance.now();
  function update(time) {
    var elapsed  = time - start;
    var progress = Math.min(elapsed / duration, 1);
    var eased    = 1 - Math.pow(1 - progress, 3);
    var current  = Math.floor(eased * target);
    el.textContent = current.toLocaleString() + "+";
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* 5. INTERSECTION OBSERVER */
var revealEls = document.querySelectorAll(".reveal");
var statItems = document.querySelectorAll(".stat-item");

var revealObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(function(el) { revealObs.observe(el); });

var statObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      var item   = entry.target;
      var target = parseInt(item.dataset.count, 10);
      var numEl  = item.querySelector(".stat-num");
      if (numEl) animateCount(numEl, target);
      statObs.unobserve(item);
    }
  });
}, { threshold: 0.3 });
statItems.forEach(function(el) { statObs.observe(el); });

/* 6. TESTIMONIAL SLIDER (mobile) */
var testiTrack = document.getElementById("testiTrack");
var testiDots  = document.getElementById("testiDots");
var testiCards = testiTrack ? testiTrack.querySelectorAll(".testi-card") : [];
var currentSlide = 0;

function isMobile() { return window.innerWidth <= 768; }

function buildDots() {
  if (!testiDots) return;
  testiDots.innerHTML = "";
  testiCards.forEach(function(_, i) {
    var d = document.createElement("div");
    d.className = "testi-dot" + (i === currentSlide ? " active" : "");
    d.addEventListener("click", function() { goToSlide(i); });
    testiDots.appendChild(d);
  });
}

function goToSlide(index) {
  currentSlide = index;
  testiCards.forEach(function(c, i) { c.classList.toggle("active", i === index); });
  document.querySelectorAll(".testi-dot").forEach(function(d, i) { d.classList.toggle("active", i === index); });
}

function initSlider() {
  if (!testiTrack) return;
  if (isMobile()) {
    goToSlide(0);
    buildDots();
  } else {
    testiCards.forEach(function(c) { c.style.display = ""; c.classList.remove("active"); });
    if (testiDots) testiDots.innerHTML = "";
  }
}
window.addEventListener("resize", initSlider);
initSlider();

/* Touch swipe */
var touchStartX = 0;
if (testiTrack) {
  testiTrack.addEventListener("touchstart", function(e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  testiTrack.addEventListener("touchend", function(e) {
    if (!isMobile()) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 40) return;
    if (dx < 0 && currentSlide < testiCards.length - 1) goToSlide(currentSlide + 1);
    if (dx > 0 && currentSlide > 0) goToSlide(currentSlide - 1);
  }, { passive: true });
}

/* 7. CONTACT FORM */
var contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function(e) {
    e.preventDefault();
    var btn = contactForm.querySelector("button[type=submit]");
    var orig = btn.textContent;
    btn.textContent = "Sending...";
    btn.disabled = true;
    setTimeout(function() {
      btn.textContent = "Message Sent!";
      btn.style.background = "#2d8a4e";
      contactForm.reset();
      setTimeout(function() {
        btn.textContent = orig;
        btn.style.background = "";
        btn.disabled = false;
      }, 3000);
    }, 1200);
  });
}
