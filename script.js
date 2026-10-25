const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Typing effect for the hero subtitle
const roles = [
  "Full-Stack Web Developer",
  "SEO Specialist",
  "Technical Team Lead",
  "Tech Content Creator",
];
const typedEl = document.getElementById("typed");

function typeLoop(roleIndex = 0, charIndex = 0, deleting = false) {
  const word = roles[roleIndex];
  typedEl.textContent = word.slice(0, charIndex);

  let delay = deleting ? 40 : 80;
  if (!deleting && charIndex === word.length) {
    deleting = true;
    delay = 1600;
  } else if (deleting && charIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 300;
  }
  setTimeout(() => typeLoop(roleIndex, charIndex + (deleting ? -1 : 1), deleting), delay);
}
if (reduceMotion) typedEl.textContent = roles[0];
else typeLoop();

// Count-up stats
function countUp(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const start = performance.now();
  const duration = 1400;
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Reveal elements on scroll (staggered per section)
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("visible");
      el.querySelectorAll("[data-count]").forEach(countUp);
      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => {
  const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
  el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 6) * 90}ms`;
  revealObserver.observe(el);
});

// Skill bars fill when their panel is visible
function fillBars(panel) {
  panel.querySelectorAll(".bar i").forEach((bar, i) => {
    bar.style.width = "0";
    setTimeout(() => (bar.style.width = bar.dataset.level + "%"), 80 + i * 70);
  });
}
const skillsSection = document.getElementById("skills");
new IntersectionObserver(
  ([entry], obs) => {
    if (entry.isIntersecting) {
      fillBars(skillsSection.querySelector(".panel.active"));
      obs.disconnect();
    }
  },
  { threshold: 0.3 }
).observe(skillsSection);

// Skill tabs with sliding indicator
const tabs = document.querySelectorAll(".tab");
const indicator = document.querySelector(".tab-indicator");

function moveIndicator(tab) {
  indicator.style.left = tab.offsetLeft + "px";
  indicator.style.top = tab.offsetTop + "px";
  indicator.style.width = tab.offsetWidth + "px";
  indicator.style.height = tab.offsetHeight + "px";
}
tabs.forEach((tab) =>
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.toggle("active", t === tab));
    document.querySelectorAll(".panel").forEach((p) => p.classList.toggle("active", p.id === tab.dataset.tab));
    moveIndicator(tab);
    fillBars(document.getElementById(tab.dataset.tab));
  })
);
window.addEventListener("load", () => moveIndicator(document.querySelector(".tab.active")));
window.addEventListener("resize", () => moveIndicator(document.querySelector(".tab.active")));

// Expandable experience timeline
document.querySelectorAll(".t-body").forEach((body) => {
  const inner = document.createElement("div");
  inner.className = "t-body-inner";
  inner.append(...body.childNodes);
  body.append(inner);
});
document.querySelectorAll(".t-head").forEach((head) =>
  head.addEventListener("click", () => {
    const item = head.parentElement;
    const open = item.classList.toggle("open");
    head.setAttribute("aria-expanded", open);
  })
);
document.querySelector(".t-item .t-head").click(); // first role open by default

// Nav: scrolled style, active link, progress bar, back-to-top
const nav = document.querySelector(".nav");
const progress = document.getElementById("progress");
const toTop = document.getElementById("toTop");
const navLinks = document.querySelectorAll("#navLinks a");

window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle("scrolled", y > 20);
    toTop.classList.toggle("show", y > 600);
    progress.style.width = (y / max) * 100 + "%";
  },
  { passive: true }
);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("active", a.dataset.section === entry.target.id));
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("section[id]").forEach((s) => sectionObserver.observe(s));

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  menuBtn.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", open);
});
navLinks.forEach((a) =>
  a.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuBtn.classList.remove("open");
  })
);

// Toast
const toast = document.getElementById("toast");
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// Copy email
document.getElementById("copyEmail").addEventListener("click", async (e) => {
  const email = e.currentTarget.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
    showToast("✓ Email copied to clipboard");
  } catch {
    window.location.href = "mailto:" + email;
  }
});

// Print / PDF
document.getElementById("printBtn").addEventListener("click", () => window.print());

document.getElementById("year").textContent = new Date().getFullYear();

// Cursor glow, 3D tilt cards and magnetic buttons (pointer devices only)
if (!reduceMotion && matchMedia("(pointer: fine)").matches) {
  const glow = document.querySelector(".glow");
  window.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });

  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-2px)`;
    });
    card.addEventListener("mouseleave", () => (card.style.transform = ""));
  });

  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
    });
    btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
  });
}

// Particle network background
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  const count = Math.min(70, Math.floor((innerWidth * innerHeight) / 18000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > innerWidth) p.vx *= -1;
    if (p.y < 0 || p.y > innerHeight) p.vy *= -1;

    ctx.fillStyle = "rgba(124, 92, 255, 0.6)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 130) {
        ctx.strokeStyle = `rgba(34, 211, 238, ${0.12 * (1 - d / 130)})`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
if (!reduceMotion) drawParticles();
