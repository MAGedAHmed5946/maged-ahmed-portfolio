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

function oneShotNoise({ duration = 0.05, volume = 0.02, hp = 900, lp = 3500 } = {}) {
  if (!soundEnabled) return;
  const ctx = ensureAudioContext();
  if (!ctx) return;

  const frameCount = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, frameCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / frameCount);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const hpFilter = ctx.createBiquadFilter();
  hpFilter.type = 'highpass';
  hpFilter.frequency.value = hp;
  const lpFilter = ctx.createBiquadFilter();
  lpFilter.type = 'lowpass';
  lpFilter.frequency.value = lp;
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  source.connect(hpFilter);
  hpFilter.connect(lpFilter);
  lpFilter.connect(gainNode);
  gainNode.connect(ctx.destination);

  source.start();
  source.stop(ctx.currentTime + duration);
}

function oneShotTone({ frequency = 220, duration = 0.05, type = 'triangle', volume = 0.025, endFrequency = null } = {}) {
  if (!soundEnabled) return;
  const ctx = ensureAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  if (endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, ctx.currentTime + duration);
  }
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
}

function playHoverSound() {
  // Revolver hammer-cock style metallic tick
  oneShotTone({ frequency: 520, endFrequency: 690, duration: 0.022, type: 'triangle', volume: 0.014 });
  setTimeout(() => oneShotNoise({ duration: 0.014, volume: 0.009, hp: 1400, lp: 6200 }), 10);
}

function playClickSound() {
  // Revolver trigger + chamber snap
  oneShotTone({ frequency: 135, endFrequency: 95, duration: 0.03, type: 'square', volume: 0.026 });
  setTimeout(() => oneShotNoise({ duration: 0.02, volume: 0.016, hp: 700, lp: 4200 }), 12);
  setTimeout(() => oneShotTone({ frequency: 840, endFrequency: 620, duration: 0.017, type: 'triangle', volume: 0.012 }), 18);
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
