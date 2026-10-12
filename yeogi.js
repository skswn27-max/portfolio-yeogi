'use strict';

const projects = [...document.querySelectorAll('.project')];
const filters = [...document.querySelectorAll('[data-filter]')];
const indexLinks = [...document.querySelectorAll('.project-index a')];

function setFilter(category) {
  filters.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.filter === category));
  });
  projects.forEach((project) => {
    project.hidden = category !== 'all' && project.dataset.category !== category;
  });
  indexLinks.forEach((link) => {
    const target = document.querySelector(link.getAttribute('href'));
    link.hidden = Boolean(target?.hidden);
    link.removeAttribute('aria-current');
  });
  updateProgress();
}

filters.forEach((button) => {
  button.addEventListener('click', () => setFilter(button.dataset.filter));
});

indexLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target?.hidden) setFilter('all');
  });
});

if ('IntersectionObserver' in window) {
  const projectObserver = new IntersectionObserver((entries) => {
    const active = entries.find((entry) => entry.isIntersecting && !entry.target.hidden);
    if (!active) return;
    indexLinks.forEach((link) => {
      link.toggleAttribute('aria-current', link.getAttribute('href') === `#${active.target.id}`);
    });
  }, { rootMargin: '-15% 0px -68% 0px' });
  projects.forEach((project) => projectObserver.observe(project));
}

const progress = document.querySelector('.reading-progress');
let progressScheduled = false;
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const value = max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0;
  progress.style.width = `${value}%`;
  progressScheduled = false;
}
window.addEventListener('scroll', () => {
  if (progressScheduled) return;
  progressScheduled = true;
  requestAnimationFrame(updateProgress);
}, { passive: true });
window.addEventListener('resize', updateProgress);

const dialog = document.querySelector('.lightbox');
const dialogImage = dialog.querySelector('img');
const dialogCaption = dialog.querySelector('p');
let previousFocus;
document.querySelectorAll('[data-image]').forEach((button) => {
  button.setAttribute('aria-label', `${button.dataset.caption} 이미지 확대`);
  button.addEventListener('click', () => {
    previousFocus = button;
    dialogImage.src = button.dataset.image;
    dialogImage.alt = button.querySelector('img')?.alt || button.dataset.caption;
    dialogCaption.textContent = button.dataset.caption;
    if (typeof dialog.showModal === 'function') {
      document.body.classList.add('modal-open');
      dialog.showModal();
    } else {
      window.open(button.dataset.image, '_blank', 'noopener,noreferrer');
    }
  });
});
dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  const outside = event.clientX < bounds.left || event.clientX > bounds.right ||
    event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (outside) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  previousFocus?.focus({ preventScroll: true });
});

document.querySelector('.print-button').addEventListener('click', () => window.print());
window.addEventListener('load', updateProgress);
updateProgress();
