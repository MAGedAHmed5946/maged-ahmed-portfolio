// Smooth scroll for nav links
const inPageAnchors = document.querySelectorAll('a[href^="#"]');
inPageAnchors.forEach((anchor) => {
  anchor.addEventListener('click', function onAnchorClick(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Header background on scroll
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => {
    header.style.background = window.scrollY > 80
      ? 'rgba(10, 13, 17, 0.95)'
      : 'linear-gradient(to bottom, rgba(11, 14, 18, 0.95), transparent)';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Scroll-triggered animations
const observerOptions = { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

document.querySelectorAll('.section').forEach((section) => observer.observe(section));

// Project modal logic
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('project-modal-title');
const modalDescription = document.getElementById('project-modal-description');
const modalYoutube = document.getElementById('project-modal-youtube');
const projectOpenButtons = document.querySelectorAll('.project-open');
const closeModalTriggers = document.querySelectorAll('[data-close-modal="true"]');
let lastFocusedElement = null;

function openProjectModal(card) {
  if (!modal || !modalTitle || !modalDescription || !modalYoutube) return;

  modalTitle.textContent = card.dataset.projectTitle || 'Project';
  modalDescription.textContent = card.dataset.projectDescription || '';
  modalYoutube.href = card.dataset.projectYoutube || '#';

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  lastFocusedElement = document.activeElement;
  const closeButton = modal.querySelector('.project-modal-close');
  if (closeButton) closeButton.focus();
}

function closeProjectModal() {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
}

projectOpenButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.project-card');
    if (card) openProjectModal(card);
    playClickSound();
  });
});

closeModalTriggers.forEach((el) => {
  el.addEventListener('click', () => {
    closeProjectModal();
    playHoverSound();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal?.classList.contains('is-open')) {
    closeProjectModal();
  }
});

// Optional UI sounds using Web Audio API (no external files required)
const soundToggle = document.getElementById('sound-toggle');
let soundEnabled = false;
let audioContext = null;

function ensureAudioContext() {
  if (audioContext) return audioContext;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  audioContext = new AudioCtx();
  return audioContext;
}

function beep({ frequency = 500, duration = 0.06, type = 'sine', volume = 0.03 } = {}) {
  if (!soundEnabled) return;
  const ctx = ensureAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
}

function playHoverSound() {
  // Soft metallic tick
  beep({ frequency: 680, duration: 0.04, type: 'triangle', volume: 0.02 });
}

function playClickSound() {
  // Deeper mechanical click
  beep({ frequency: 180, duration: 0.055, type: 'square', volume: 0.028 });
  setTimeout(() => beep({ frequency: 320, duration: 0.03, type: 'triangle', volume: 0.018 }), 24);
}

function updateSoundLabel() {
  if (!soundToggle) return;
  const label = soundToggle.querySelector('.sound-label');
  if (label) {
    label.textContent = soundEnabled ? 'Sound On' : 'Sound Off';
  }
  soundToggle.setAttribute('aria-pressed', soundEnabled ? 'true' : 'false');
}

if (soundToggle) {
  soundToggle.addEventListener('click', async () => {
    soundEnabled = !soundEnabled;

    const ctx = ensureAudioContext();
    if (ctx?.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (_error) {
        soundEnabled = false;
      }
    }

    updateSoundLabel();
    if (soundEnabled) playClickSound();
  });

  const hoverTargets = document.querySelectorAll('.nav-link, .btn, .project-open, .contact-link, .project-modal-close');
  hoverTargets.forEach((target) => {
    target.addEventListener('mouseenter', () => playHoverSound());
    target.addEventListener('click', () => playClickSound());
  });

  updateSoundLabel();
}
