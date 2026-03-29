// ================= SELECT ELEMENTS =================
const video = document.getElementById("heroVideo");
const content = document.querySelector(".hero-content");

// ================= SCROLL EFFECT =================
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  // Smooth zoom
  const scale = 1 + scrollY * 0.0005;

  // Move text slightly down
  const contentMove = scrollY * 0.2;

  video.style.transform = `scale(${scale})`;
  content.style.transform = `translate(-50%, calc(-50% + ${contentMove}px))`;
});

// ================= MOUSE PARALLAX =================
let mouseX = 0;
let mouseY = 0;

// Capture mouse position
document.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
});

// Smooth animation loop
function animate() {
  // Combine scale + parallax
  const scrollY = window.scrollY;
  const scale = 1 + scrollY * 0.0005;

  video.style.transform = `scale(${scale}) translate(${mouseX}px, ${mouseY}px)`;

  requestAnimationFrame(animate);
}

animate();
