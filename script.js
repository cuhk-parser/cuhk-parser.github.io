const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];

const updateHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

menuButton.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

sectionLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".lang-toggle a").forEach((link) => {
  link.addEventListener("click", (event) => {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    if (link.getAttribute("aria-current") === "page") {
      event.preventDefault();
      return;
    }
    if (!location.hash) return;
    event.preventDefault();
    location.assign(`${link.getAttribute("href")}${location.hash}`);
  });
});

const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    sectionLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.2, 0.5] },
);

sections.forEach((section) => sectionObserver.observe(section));

const copyButton = document.querySelector("#copy-citation");
const citation = document.querySelector("#bibtex");

const copyLabel = copyButton.dataset.copyLabel || "Copy BibTeX";
const copiedLabel = copyButton.dataset.copiedLabel || "Copied!";

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(citation.textContent);
    copyButton.querySelector("span").textContent = copiedLabel;
    setTimeout(() => {
      copyButton.querySelector("span").textContent = copyLabel;
    }, 1800);
  } catch {
    const range = document.createRange();
    range.selectNodeContents(citation);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
});
