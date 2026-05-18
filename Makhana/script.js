// Theme toggle
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;
const THEME_KEY = "makhana-theme";

function applyTheme(theme) {
  if (theme === "dark") {
    root.setAttribute("data-theme", "dark");
    root.style.colorScheme = "dark";
  } else {
    root.removeAttribute("data-theme");
    root.style.colorScheme = "light";
    theme = "light";
  }
  localStorage.setItem(THEME_KEY, theme);
}

const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme === "dark" || savedTheme === "light") {
  applyTheme(savedTheme);
}

themeToggle?.addEventListener("click", () => {
  const isDark = root.getAttribute("data-theme") === "dark";
  applyTheme(isDark ? "light" : "dark");
});

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const navbar = document.getElementById("navbar");

function setMenuOpen(open) {
  navLinks?.classList.toggle("open", open);
  navToggle?.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  navToggle?.setAttribute("aria-expanded", open ? "true" : "false");
}

navToggle?.addEventListener("click", () => {
  setMenuOpen(!navLinks?.classList.contains("open"));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

// Navbar shadow on scroll
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
});

// Scroll reveal animations
const revealSelectors = [
  ".timeline-step",
  ".timeline-ready",
  ".info-card",
  ".age-card",
];

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

revealSelectors.forEach((selector) => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
    observer.observe(el);
  });
});

// Stagger timeline steps
document.querySelectorAll(".timeline-step").forEach((step, i) => {
  step.style.transitionDelay = `${i * 0.12}s`;
});

// Animate global market share bars when visible
const globalChart = document.getElementById("globalChart");
if (globalChart) {
  const chartObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("chart-animate");
          chartObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );
  chartObserver.observe(globalChart);
}

// Badge pop on hover (subtle scale via CSS; add click ripple)
document.querySelectorAll(".badge").forEach((badge) => {
  badge.addEventListener("click", () => {
    badge.style.transform = "scale(0.95)";
    setTimeout(() => {
      badge.style.transform = "";
    }, 150);
  });
});

// Smooth active nav highlight
const sections = document.querySelectorAll("section[id], header[id]");
const navAnchors = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) current = section.getAttribute("id");
  });
  navAnchors.forEach((a) => {
    if (a.getAttribute("href") === `#${current}`) {
      a.classList.add("active");
    } else {
      a.classList.remove("active");
    }
  });
});
