const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll(".case-card, .achievement-strip article, .game-grid article, .campus-card").forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${Math.min(index * 70, 420)}ms`);
  item.classList.add("reveal");
});

const filterButtons = document.querySelectorAll("[data-filter]");
const caseCards = document.querySelectorAll("[data-category]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));

    caseCards.forEach((card, index) => {
      const visible = filter === "all" || card.dataset.category === filter;
      card.style.setProperty("--reveal-delay", `${index * 70}ms`);

      if (visible) {
        card.hidden = false;
        requestAnimationFrame(() => {
          card.classList.remove("is-hidden");
          card.classList.add("is-visible");
        });
      } else {
        card.classList.add("is-hidden");
        window.setTimeout(() => {
          if (card.classList.contains("is-hidden")) {
            card.hidden = true;
          }
        }, prefersReducedMotion ? 0 : 240);
      }
    });
  });
});

const skillTabs = document.querySelectorAll("[data-skill-tab]");
const skillPanels = document.querySelectorAll("[data-skill-panel]");

skillTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.skillTab;
    skillTabs.forEach((item) => item.classList.toggle("is-active", item === tab));
    skillPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.skillPanel === target);
    });
  });
});

const navLinks = document.querySelectorAll(".nav a[href^='#']");
const sections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean)
  .sort((a, b) => a.offsetTop - b.offsetTop);

const setActiveNav = () => {
  const current = sections
    .filter((section) => section.getBoundingClientRect().top < 260)
    .pop();

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", current && link.getAttribute("href") === `#${current.id}`);
  });
};

const header = document.querySelector(".site-header");
const backToTop = document.querySelector(".back-to-top");

const handleScroll = () => {
  setActiveNav();
  header.classList.toggle("is-scrolled", window.scrollY > 24);
  backToTop.classList.toggle("is-visible", window.scrollY > 700);
};

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -8% 0px", threshold: 0.02 }
);

document.querySelectorAll(".reveal").forEach((item, index) => {
  if (!item.style.getPropertyValue("--reveal-delay")) {
    item.style.setProperty("--reveal-delay", `${Math.min(index * 60, 360)}ms`);
  }
  observer.observe(item);
});

const showVisibleReveals = () => {
  document.querySelectorAll(".reveal:not(.is-visible)").forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.96 && rect.bottom > 0) {
      item.classList.add("is-visible");
      observer.unobserve(item);
    }
  });
};

window.addEventListener("load", showVisibleReveals);
window.addEventListener("hashchange", () => window.setTimeout(showVisibleReveals, 120));
window.setTimeout(showVisibleReveals, 180);

if (!prefersReducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  let glowX = window.innerWidth / 2;
  let glowY = window.innerHeight / 2;
  let targetX = glowX;
  let targetY = glowY;

  const animateGlow = () => {
    glowX += (targetX - glowX) * 0.12;
    glowY += (targetY - glowY) * 0.12;
    glow.style.transform = `translate3d(${glowX - 110}px, ${glowY - 110}px, 0)`;
    requestAnimationFrame(animateGlow);
  };

  window.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    glow.classList.add("is-visible");
  });

  window.addEventListener("pointerleave", () => glow.classList.remove("is-visible"));
  animateGlow();
}

window.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();
