document.documentElement.classList.add("has-js");

const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");

document.querySelector("[data-year]").textContent = new Date().getFullYear();

const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 30);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const closeMenu = () => {
  menuButton.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
  document.body.style.overflow = "";
};

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("is-open", !isOpen);
  document.body.style.overflow = isOpen ? "" : "hidden";
});

nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));

document.querySelectorAll("[data-lightbox-src]").forEach((card) => {
  card.addEventListener("click", () => {
    lightboxImage.src = card.dataset.lightboxSrc;
    lightboxImage.alt = card.querySelector("img").alt;
    lightboxCaption.textContent = card.dataset.lightboxTitle;
    lightbox.showModal();
    document.body.style.overflow = "hidden";
  });
});

const closeLightbox = () => {
  lightbox.close();
  lightboxImage.src = "";
  document.body.style.overflow = "";
};

document.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox.addEventListener("close", () => {
  lightboxImage.src = "";
  document.body.style.overflow = "";
});
