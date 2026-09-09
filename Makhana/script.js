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
const mobileMenu = document.getElementById("mobileMenu");
const navLinks = document.getElementById("navLinks");
const navbar = document.getElementById("navbar");

function setMenuOpen(open) {
  mobileMenu?.classList.toggle("open", open);
  navToggle?.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  navToggle?.setAttribute("aria-expanded", open ? "true" : "false");
  mobileMenu?.setAttribute("aria-hidden", open ? "false" : "true");
}

navToggle?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  setMenuOpen(!mobileMenu?.classList.contains("open"));
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.querySelectorAll(".nav-links--desktop a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) setMenuOpen(false);
});

// Smooth active nav highlight
const allNavAnchors = document.querySelectorAll(".nav-links--desktop a, .mobile-menu-links a");
const sections = document.querySelectorAll("section[id], header[id]");

window.addEventListener("scroll", () => {
  navbar?.classList.toggle("scrolled", window.scrollY > 40);

  let current = "";
  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) current = section.getAttribute("id");
  });
  allNavAnchors.forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
  });
});

// Scroll reveal animations
const revealSelectors = [
  ".about-reveal",
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
    const isAbout = el.closest(".about-section");
    el.style.transitionDelay = isAbout ? `${(i % 6) * 0.07}s` : `${i * 0.08}s`;
    observer.observe(el);
  });
});

// About story slider
(function initAboutSlider() {
  const slider = document.getElementById("aboutSlider");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".about-slide"));
  const dots = Array.from(slider.querySelectorAll(".about-dot"));
  const prevBtn = document.getElementById("aboutPrev");
  const nextBtn = document.getElementById("aboutNext");
  if (!slides.length) return;

  let index = 0;
  let timer = null;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function goTo(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
    });
    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  function startAuto() {
    if (reduceMotion) return;
    stopAuto();
    timer = setInterval(next, 6500);
  }

  function stopAuto() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  prevBtn?.addEventListener("click", () => {
    prev();
    startAuto();
  });

  nextBtn?.addEventListener("click", () => {
    next();
    startAuto();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goTo(Number(dot.dataset.index) || 0);
      startAuto();
    });
  });

  let touchStartX = 0;
  let touchDeltaX = 0;

  slider.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].clientX;
      touchDeltaX = 0;
      stopAuto();
    },
    { passive: true }
  );

  slider.addEventListener(
    "touchmove",
    (event) => {
      touchDeltaX = event.changedTouches[0].clientX - touchStartX;
    },
    { passive: true }
  );

  slider.addEventListener(
    "touchend",
    () => {
      if (Math.abs(touchDeltaX) > 45) {
        if (touchDeltaX < 0) next();
        else prev();
      }
      startAuto();
    },
    { passive: true }
  );

  slider.addEventListener("mouseenter", stopAuto);
  slider.addEventListener("mouseleave", startAuto);

  goTo(0);
  startAuto();
})();

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

// Day theme — random wind-blown leaves & flower petals
(function initWindParticles() {
  const container = document.getElementById("windParticles");
  if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const PETAL_COLORS = [
    "#f9a8d4",
    "#f472b6",
    "#fbbf24",
    "#fef08a",
    "#fda4af",
    "#e879f9",
    "#fff1f2",
    "#fcd34d",
    "#fbcfe8",
    "#c4b5fd",
  ];
  const LEAF_VARIANTS = ["wind-leaf--a", "wind-leaf--b", "wind-leaf--c"];
  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;
  const particleCount = () => (isMobile() ? 9 : 16);

  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function buildPath(ltr) {
    const w1 = rand(-6, 6);
    const w2 = rand(-8, 8);
    const w3 = rand(-5, 7);
    const w4 = rand(-4, 6);
    const spin = rand(280, 420) * (Math.random() > 0.5 ? 1 : -1);

    if (ltr) {
      return [
        { transform: "translate3d(-14vw, 0, 0) rotate(-30deg)", opacity: 0 },
        { transform: `translate3d(12vw, ${w1}vh, 0) rotate(${rand(20, 80)}deg)`, opacity: 0.88, offset: 0.12 },
        { transform: `translate3d(32vw, ${w2}vh, 0) rotate(${rand(90, 160)}deg)`, opacity: 0.9, offset: 0.32 },
        { transform: `translate3d(55vw, ${w3}vh, 0) rotate(${rand(170, 250)}deg)`, opacity: 0.85, offset: 0.52 },
        { transform: `translate3d(78vw, ${w4}vh, 0) rotate(${rand(260, 320)}deg)`, opacity: 0.82, offset: 0.74 },
        { transform: `translate3d(102vw, ${rand(-2, 8)}vh, 0) rotate(${spin}deg)`, opacity: 0.78, offset: 0.92 },
        { transform: `translate3d(118vw, ${rand(0, 10)}vh, 0) rotate(${spin + 40}deg)`, opacity: 0 },
      ];
    }

    return [
      { transform: "translate3d(114vw, 0, 0) rotate(30deg)", opacity: 0 },
      { transform: `translate3d(88vw, ${w1}vh, 0) rotate(${rand(-70, -20)}deg)`, opacity: 0.88, offset: 0.12 },
      { transform: `translate3d(64vw, ${w2}vh, 0) rotate(${rand(-150, -90)}deg)`, opacity: 0.9, offset: 0.32 },
      { transform: `translate3d(40vw, ${w3}vh, 0) rotate(${rand(-240, -170)}deg)`, opacity: 0.85, offset: 0.52 },
      { transform: `translate3d(18vw, ${w4}vh, 0) rotate(${rand(-310, -250)}deg)`, opacity: 0.82, offset: 0.74 },
      { transform: `translate3d(-4vw, ${rand(-2, 8)}vh, 0) rotate(${spin}deg)`, opacity: 0.78, offset: 0.92 },
      { transform: `translate3d(-16vw, ${rand(0, 10)}vh, 0) rotate(${spin - 40}deg)`, opacity: 0 },
    ];
  }

  function runParticle(el) {
    const ltr = Math.random() > 0.5;
    el.style.top = `${rand(4, 92)}%`;
    el.style.left = "0";

    const duration = rand(22000, 48000);
    const anim = el.animate(buildPath(ltr), {
      duration,
      easing: "cubic-bezier(0.33, 0.02, 0.2, 1)",
      fill: "forwards",
    });

    anim.onfinish = () => {
      if (el.isConnected) runParticle(el);
    };
  }

  function createParticle() {
    const isPetal = Math.random() < 0.42;
    const el = document.createElement("span");
    el.className = isPetal ? "wind-particle wind-petal" : `wind-particle wind-leaf ${pick(LEAF_VARIANTS)}`;

    if (isPetal) {
      el.style.setProperty("--petal-color", pick(PETAL_COLORS));
      el.style.transform = `rotate(${rand(0, 360)}deg)`;
    }

    container.appendChild(el);
  }

  function spawnAll() {
    container.innerHTML = "";
    const count = particleCount();
    for (let i = 0; i < count; i += 1) {
      createParticle();
    }
    container.querySelectorAll(".wind-particle").forEach((el, i) => {
      setTimeout(() => runParticle(el), i * 350);
    });
  }

  spawnAll();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(spawnAll, 300);
  });
})();

// Copy contact details to clipboard
const copyButtons = document.querySelectorAll(".copy-btn");

async function copyTextToClipboard(value) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const helper = document.createElement("textarea");
  helper.value = value;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  helper.style.pointerEvents = "none";
  document.body.appendChild(helper);
  helper.select();
  document.execCommand("copy");
  helper.remove();
}

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copyValue || "";
    const originalText = button.textContent;

    try {
      await copyTextToClipboard(value);
      button.textContent = "Copied!";
      button.classList.add("copied");

      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("copied");
      }, 1500);
    } catch (error) {
      button.textContent = "Failed";
      button.classList.add("error");

      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("error");
      }, 1500);
    }
  });
});
