/* =====================================================
   Omega Sequence — interactions
   ===================================================== */

// Init AOS
AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
});

// Init Lucide icons
lucide.createIcons();

/* ---------- Navbar scroll state ---------- */
const navbar = document.getElementById('navbar');
const onScroll = () => {
  if (!navbar) return;
  if (window.scrollY > 20) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
};
if (navbar) {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Responsive mobile navigation ---------- */
(function bindMobileNav() {
  const toggle = document.getElementById('mobileMenuToggle');
  const menu = document.getElementById('mobileMenu');
  const iconOpen = document.getElementById('mobileMenuIconOpen');
  const iconClose = document.getElementById('mobileMenuIconClose');
  if (!toggle || !menu) return;

  function setOpen(open) {
    menu.classList.toggle('hidden', !open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (iconOpen) iconOpen.classList.toggle('hidden', open);
    if (iconClose) iconClose.classList.toggle('hidden', !open);
  }

  toggle.addEventListener('click', e => {
    e.stopPropagation();
    setOpen(menu.classList.contains('hidden'));
  });

  menu.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('click', e => {
    if (menu.classList.contains('hidden')) return;
    if (navbar && navbar.contains(e.target)) return;
    setOpen(false);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 1024px)').matches) setOpen(false);
  });
})();

/* ---------- GDPR cookie consent banner ---------- */
(function cookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;

  // If user already chose, do nothing
  if (localStorage.getItem('cookieConsent')) return;

  // Reveal after a short delay so the user can see the hero first
  setTimeout(() => {
    banner.classList.remove('hidden');
    // Force a reflow before adding the show class so the transition fires
    void banner.offsetWidth;
    banner.classList.add('cookie-show');
  }, 1200);

  function dismiss(value) {
    localStorage.setItem('cookieConsent', value);
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    banner.classList.remove('cookie-show');
    banner.classList.add('cookie-hide');
    setTimeout(() => banner.classList.add('hidden'), 450);
  }

  const accept    = document.getElementById('cookieAccept');
  const necessary = document.getElementById('cookieNecessary');
  if (accept)    accept.addEventListener('click', () => dismiss('all'));
  if (necessary) necessary.addEventListener('click', () => dismiss('necessary'));
})();

/* ---------- First-scroll Omega rain ---------- */
(function omegaRain() {
  if (document.body.dataset.page !== 'landing') return;
  // Respect reduced-motion users
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function spawn() {
    const layer = document.createElement('div');
    layer.className = 'omega-rain';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);

    const COUNT = window.innerWidth < 640 ? 28 : 55;
    const longest = { ms: 0 };

    for (let i = 0; i < COUNT; i++) {
      const drop = document.createElement('span');
      drop.className = 'omega-drop';
      drop.textContent = 'Ω';

      const xPct       = Math.random() * 100;                          // 0–100 vw
      const size       = 14 + Math.random() * 48;                      // 14–62 px
      const duration   = 3.2 + Math.random() * 3.5;                    // 3.2–6.7 s
      const delay      = Math.random() * 2.2;                          // 0–2.2 s
      const rotation   = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 540);
      const drift      = (Math.random() - 0.5) * 180;                  // ±90 px sideways
      const peakOp     = 0.45 + Math.random() * 0.5;                   // 0.45–0.95
      const blur       = Math.random() < 0.25 ? Math.random() * 1.5 : 0;

      drop.style.left            = xPct + 'vw';
      drop.style.fontSize        = size + 'px';
      drop.style.animationDuration = duration + 's';
      drop.style.animationDelay  = delay + 's';
      drop.style.setProperty('--drift',        drift + 'px');
      drop.style.setProperty('--rotation',     rotation + 'deg');
      drop.style.setProperty('--peak-opacity', peakOp);
      if (blur) drop.style.filter = `blur(${blur}px)`;

      layer.appendChild(drop);

      const finishMs = (delay + duration) * 1000;
      if (finishMs > longest.ms) longest.ms = finishMs;
    }

    // Clean the DOM up once the last drop finishes
    setTimeout(() => layer.remove(), longest.ms + 250);
  }

  let triggered = false;
  function onFirstScroll() {
    if (triggered) return;
    if (window.scrollY < 30) return; // ignore micro-scrolls / overscroll bounces
    triggered = true;
    window.removeEventListener('scroll', onFirstScroll);
    spawn();
  }
  window.addEventListener('scroll', onFirstScroll, { passive: true });
})();

/* ---------- Mentorship lesson player shell ---------- */
(function mentorshipLessonPlayer() {
  const players = document.querySelectorAll('[data-lesson-player]');
  if (!players.length) return;

  const veils = [];

  function setVeil(show) {
    veils.forEach(veil => {
      veil.classList.toggle('hidden', !show);
      veil.classList.toggle('grid', show);
    });
  }

  players.forEach(player => {
    const veil = player.querySelector('[data-protection-veil]');
    if (veil) veils.push(veil);

    player.addEventListener('contextmenu', e => e.preventDefault());
    player.addEventListener('dragstart', e => e.preventDefault());

    player.querySelectorAll('[data-lesson-video]').forEach(video => {
      video.setAttribute('controlsList', 'nodownload noplaybackrate noremoteplayback');
      video.setAttribute('disablePictureInPicture', '');
      video.disablePictureInPicture = true;
      video.addEventListener('contextmenu', e => e.preventDefault());
      video.addEventListener('dragstart', e => e.preventDefault());
    });
  });

  document.addEventListener('visibilitychange', () => {
    setVeil(document.hidden);
  });

  window.addEventListener('blur', () => setVeil(true));
  window.addEventListener('focus', () => setVeil(false));
})();

/* ---------- Mentorship phase progress ---------- */
(function mentorshipPhaseProgress() {
  const root = document.querySelector('[data-lesson-progress]');
  if (!root) return;

  const phaseId = root.dataset.phaseId || '01';
  const userId = root.dataset.userId || 'guest';
  const requiredExamples = Number(root.dataset.requiredExamples || 15);
  const progressEndpoint = root.dataset.progressEndpoint || '';
  const progressToken = root.dataset.progressToken || '';
  const lessonCards = Array.from(root.querySelectorAll('[data-lesson-card]'));
  const chartSlots = Array.from(root.querySelectorAll('[data-chart-slot]'));
  const lessons = lessonCards.map((card, index) => ({
    card,
    index,
    id: card.dataset.lessonId || '',
    title: card.dataset.lessonTitle || '',
    phase: card.dataset.lessonPhase || '',
    duration: card.dataset.lessonDuration || '',
  })).filter(lesson => lesson.id);
  const lessonIds = lessons.map(lesson => lesson.id);
  const chartKey = `omega.phase.${userId}.${phaseId}.chartCount`;

  const videoProgressLabel = root.querySelector('[data-video-progress-label]');
  const videoProgressSmall = root.querySelector('[data-video-progress-small]');
  const videoProgressBar = root.querySelector('[data-video-progress-bar]');
  const focusedTitle = root.querySelector('[data-focused-lesson-title]');
  const focusedMeta = root.querySelector('[data-focused-lesson-meta]');
  const focusedHeading = root.querySelector('[data-focused-lesson-heading]');
  const focusedPhase = root.querySelector('[data-focused-lesson-phase]');
  const focusedDuration = root.querySelector('[data-focused-lesson-duration]');
  const focusedState = root.querySelector('[data-focused-lesson-state]');
  const focusedReady = root.querySelector('[data-focused-lesson-ready]');
  const focusedLocked = root.querySelector('[data-focused-lesson-locked]');
  const focusedLockCopy = root.querySelector('[data-focused-lock-copy]');
  const lessonVideo = root.querySelector('[data-lesson-video]');
  const prevLessonButton = root.querySelector('[data-prev-lesson-button]');
  const nextLessonButton = root.querySelector('[data-next-lesson-button]');
  const lessonCompleteButton = root.querySelector('[data-lesson-complete-button]');
  const lessonCompleteIcon = root.querySelector('[data-lesson-button-icon]');
  const lessonCompleteLabel = root.querySelector('[data-lesson-button-label]');
  const chartProgressLabel = root.querySelector('[data-chart-progress-label]');
  const chartCountLabel = root.querySelector('[data-chart-count-label]');
  const chartPercent = root.querySelector('[data-chart-percent]');
  const chartProgressBar = root.querySelector('[data-chart-progress-bar]');
  const chartProofGate = root.querySelector('[data-chart-proof-gate]');
  const chartProofHelp = root.querySelector('[data-chart-proof-help]');
  const chartProofButton = root.querySelector('[data-chart-proof-button]');
  const chartProofButtonIcon = root.querySelector('[data-chart-proof-button-icon]');
  const chartProofButtonLabel = root.querySelector('[data-chart-proof-button-label]');
  const chartProofInput = root.querySelector('[data-chart-proof-input]');
  const uploadCard = root.querySelector('[data-upload-card]');
  const uploadIcon = root.querySelector('[data-upload-icon]');
  const uploadIconShell = root.querySelector('[data-upload-icon-shell]');
  const uploadTitle = root.querySelector('[data-upload-title]');
  const uploadCopy = root.querySelector('[data-upload-copy]');
  const assessmentStatusLabel = root.querySelector('[data-assessment-status-label]');
  const phaseStatusLabel = root.querySelector('[data-phase-status-label]');

  function readInitialCompletedLessons() {
    try {
      const parsed = JSON.parse(root.dataset.completedLessons || '[]');
      return new Set(Array.isArray(parsed) ? parsed.filter(id => lessonIds.includes(id)) : []);
    } catch {
      return new Set();
    }
  }

  function readChartCount() {
    const count = Number(localStorage.getItem(chartKey) || 0);
    if (!Number.isFinite(count)) return 0;
    return Math.max(0, Math.min(requiredExamples, count));
  }

  let completedLessons = readInitialCompletedLessons();
  let chartCount = readChartCount();
  let activeIndex = 0;

  function writeChartState() {
    localStorage.setItem(chartKey, String(chartCount));
  }

  async function saveLessonCompletion(lessonId, completed) {
    if (!progressEndpoint) return;

    const response = await fetch(progressEndpoint.replace('__LESSON_ID__', encodeURIComponent(lessonId)), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({
        phase: phaseId,
        completed,
        _token: progressToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Could not save lesson progress.');
    }

    const data = await response.json();
    const ids = Array.isArray(data.completed_lesson_ids) ? data.completed_lesson_ids : [];
    completedLessons = new Set(ids.filter(id => lessonIds.includes(id)));
  }

  function setIcon(icon, name) {
    if (!icon) return;
    icon.setAttribute('data-lucide', name);
  }

  function isLessonCompleted(index) {
    const lesson = lessons[index];
    return Boolean(lesson && completedLessons.has(lesson.id));
  }

  function isLessonUnlocked(index) {
    if (index <= 0) return true;
    return lessons.slice(0, index).every(lesson => completedLessons.has(lesson.id));
  }

  function setButtonEnabled(enabled) {
    if (!chartProofButton || !chartProofInput) return;

    chartProofButton.disabled = !enabled;
    chartProofInput.disabled = !enabled;
    chartProofButton.classList.toggle('cursor-not-allowed', !enabled);
    chartProofButton.classList.toggle('text-white/35', !enabled);
    chartProofButton.classList.toggle('text-ink-900', enabled);
    chartProofButton.classList.toggle('bg-white/[0.04]', !enabled);
    chartProofButton.classList.toggle('bg-omega-300', enabled);
    chartProofButton.classList.toggle('hover:bg-omega-200', enabled);
    setIcon(chartProofButtonIcon, enabled ? 'upload-cloud' : 'lock');
    if (chartProofButtonLabel) chartProofButtonLabel.textContent = enabled ? 'Upload chart examples' : 'Complete videos first';
  }

  function setFocusedLesson(index) {
    activeIndex = Math.max(0, Math.min(index, lessons.length - 1));
    render();
  }

  function render() {
    const totalLessons = lessons.length;
    const completedCount = completedLessons.size;
    const videoPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    const videosComplete = totalLessons > 0 && completedCount === totalLessons;
    const chartPercentValue = Math.round((chartCount / requiredExamples) * 100);
    const chartsComplete = chartCount >= requiredExamples;
    const activeLesson = lessons[activeIndex] || lessons[0];
    const activeUnlocked = isLessonUnlocked(activeIndex);
    const activeCompleted = isLessonCompleted(activeIndex);

    if (videoProgressLabel) videoProgressLabel.textContent = `${completedCount} / ${totalLessons}`;
    if (videoProgressSmall) videoProgressSmall.textContent = `${videoPercent}%`;
    if (videoProgressBar) videoProgressBar.style.width = `${videoPercent}%`;
    if (focusedTitle) focusedTitle.textContent = activeLesson ? activeLesson.title : '';
    if (focusedHeading) focusedHeading.textContent = activeLesson ? activeLesson.title : '';
    if (focusedMeta) focusedMeta.textContent = activeLesson ? `${activeLesson.phase} / ${activeLesson.duration}` : '';
    if (focusedPhase) focusedPhase.textContent = activeLesson ? activeLesson.phase : '';
    if (focusedDuration) focusedDuration.textContent = activeLesson ? activeLesson.duration : '';
    if (focusedState) {
      focusedState.textContent = activeCompleted ? 'Completed' : activeUnlocked ? 'Not finished' : 'Locked';
      focusedState.classList.toggle('text-omega-300', activeCompleted);
      focusedState.classList.toggle('text-white/38', !activeCompleted);
    }
    if (focusedReady) focusedReady.classList.toggle('hidden', !activeUnlocked);
    if (focusedLocked) {
      focusedLocked.classList.toggle('hidden', activeUnlocked);
      focusedLocked.classList.toggle('grid', !activeUnlocked);
    }
    if (focusedLockCopy) {
      focusedLockCopy.textContent = activeIndex === 0
        ? 'This lesson is available now.'
        : 'Mark the previous video finished to unlock this lesson.';
    }
    if (lessonVideo) {
      lessonVideo.toggleAttribute('controls', activeUnlocked);
      lessonVideo.style.pointerEvents = activeUnlocked ? '' : 'none';
    }
    if (prevLessonButton) {
      prevLessonButton.disabled = activeIndex === 0;
      prevLessonButton.classList.toggle('cursor-not-allowed', activeIndex === 0);
      prevLessonButton.classList.toggle('opacity-45', activeIndex === 0);
    }
    if (nextLessonButton) {
      nextLessonButton.disabled = activeIndex >= totalLessons - 1;
      nextLessonButton.classList.toggle('cursor-not-allowed', activeIndex >= totalLessons - 1);
      nextLessonButton.classList.toggle('opacity-45', activeIndex >= totalLessons - 1);
    }
    if (lessonCompleteButton) {
      lessonCompleteButton.disabled = !activeUnlocked || activeCompleted;
      lessonCompleteButton.classList.toggle('cursor-not-allowed', !activeUnlocked || activeCompleted);
      lessonCompleteButton.classList.toggle('bg-omega-300', activeCompleted);
      lessonCompleteButton.classList.toggle('text-ink-900', activeCompleted);
      lessonCompleteButton.classList.toggle('border-omega-300', activeCompleted);
      lessonCompleteButton.classList.toggle('bg-white/[0.04]', !activeCompleted);
      lessonCompleteButton.classList.toggle('text-white/70', !activeCompleted);
      setIcon(lessonCompleteIcon, activeCompleted ? 'check-circle-2' : activeUnlocked ? 'circle' : 'lock');
      if (lessonCompleteLabel) {
        lessonCompleteLabel.textContent = activeCompleted ? 'Completed' : activeUnlocked ? 'Mark finished' : 'Locked';
      }
    }
    if (chartProgressLabel) chartProgressLabel.textContent = `${chartCount} / ${requiredExamples}`;
    if (chartCountLabel) chartCountLabel.textContent = `${chartCount} / ${requiredExamples}`;
    if (chartPercent) chartPercent.textContent = `${chartPercentValue}%`;
    if (chartProgressBar) chartProgressBar.style.width = `${chartPercentValue}%`;
    if (assessmentStatusLabel) assessmentStatusLabel.textContent = chartsComplete ? 'Ready' : 'Pending';
    if (phaseStatusLabel) phaseStatusLabel.textContent = chartsComplete ? 'Assessment' : 'Locked';

    setButtonEnabled(videosComplete);

    if (chartProofGate) chartProofGate.classList.toggle('is-unlocked', videosComplete);
    if (chartProofHelp) {
      chartProofHelp.textContent = videosComplete
        ? 'Chart proof is unlocked. Select 15 annotated examples for this phase.'
        : 'Complete all phase videos to unlock the chart-example upload step.';
    }
    if (uploadCard) {
      uploadCard.classList.toggle('border-omega-400/25', videosComplete);
      uploadCard.classList.toggle('bg-omega-500/[0.035]', videosComplete);
      uploadCard.classList.toggle('border-white/15', !videosComplete);
      uploadCard.classList.toggle('bg-white/[0.025]', !videosComplete);
    }
    if (uploadIconShell) {
      uploadIconShell.classList.toggle('border-omega-400/25', videosComplete);
      uploadIconShell.classList.toggle('bg-omega-500/10', videosComplete);
      uploadIconShell.classList.toggle('text-omega-300', videosComplete);
      uploadIconShell.classList.toggle('border-white/10', !videosComplete);
      uploadIconShell.classList.toggle('bg-white/[0.04]', !videosComplete);
      uploadIconShell.classList.toggle('text-white/35', !videosComplete);
    }
    setIcon(uploadIcon, videosComplete ? 'upload-cloud' : 'lock');
    if (uploadTitle) uploadTitle.textContent = videosComplete ? 'Upload is open' : 'Locked until videos are done';
    if (uploadCopy) {
      uploadCopy.textContent = videosComplete
        ? 'Choose your annotated chart screenshots. This UI tracks the count until the real upload endpoint is added.'
        : 'The upload step opens automatically after every lesson has been marked completed.';
    }

    lessons.forEach(lesson => {
      const card = lesson.card;
      const done = completedLessons.has(lesson.id);
      const unlocked = isLessonUnlocked(lesson.index);
      const active = lesson.index === activeIndex;
      const state = card.querySelector('[data-lesson-state-label]');
      const tabIcon = card.querySelector('[data-lesson-tab-icon]');
      const tabShell = card.querySelector('[data-lesson-tab-icon-shell]');

      card.classList.toggle('border-omega-400/30', active || done);
      card.classList.toggle('bg-omega-500/10', active || done);
      card.classList.toggle('bg-white/[0.025]', !active && !done);
      card.classList.toggle('opacity-55', !unlocked && !active);
      card.classList.toggle('is-complete', done);
      if (state) {
        state.textContent = done ? 'Completed' : unlocked ? active ? 'Current' : 'Available' : 'Locked';
        state.classList.toggle('text-omega-300', done);
      }
      setIcon(tabIcon, done ? 'check-circle-2' : unlocked ? active ? 'play-circle' : 'circle' : 'lock');
      if (tabShell) {
        tabShell.classList.toggle('bg-omega-300', done);
        tabShell.classList.toggle('text-ink-900', done);
        tabShell.classList.toggle('bg-omega-500/10', unlocked && !done);
        tabShell.classList.toggle('text-omega-300', unlocked && !done);
        tabShell.classList.toggle('bg-ink-900', !unlocked && !done);
        tabShell.classList.toggle('text-white/45', !unlocked && !done);
      }
    });

    chartSlots.forEach((slot, index) => {
      const filled = index < chartCount;
      slot.classList.toggle('border-omega-400/30', filled);
      slot.classList.toggle('bg-omega-500/10', filled);
      slot.classList.toggle('text-omega-200', filled);
      slot.classList.toggle('border-white/10', !filled);
      slot.classList.toggle('bg-white/[0.035]', !filled);
      slot.classList.toggle('text-white/35', !filled);
    });

    if (window.lucide) lucide.createIcons();
  }

  lessons.forEach(lesson => {
    lesson.card.addEventListener('click', () => {
      setFocusedLesson(lesson.index);
    });
  });

  if (prevLessonButton) {
    prevLessonButton.addEventListener('click', () => {
      if (activeIndex > 0) setFocusedLesson(activeIndex - 1);
    });
  }

  if (nextLessonButton) {
    nextLessonButton.addEventListener('click', () => {
      if (activeIndex < lessons.length - 1) setFocusedLesson(activeIndex + 1);
    });
  }

  if (lessonCompleteButton) {
    lessonCompleteButton.addEventListener('click', async () => {
      const lesson = lessons[activeIndex];
      if (!lesson || !isLessonUnlocked(activeIndex) || isLessonCompleted(activeIndex)) return;

      const previousCompleted = new Set(completedLessons);

      lessonCompleteButton.disabled = true;
      completedLessons.add(lesson.id);
      render();

      try {
        await saveLessonCompletion(lesson.id, true);
        if (activeIndex < lessons.length - 1) {
          setFocusedLesson(activeIndex + 1);
        }
      } catch {
        completedLessons = previousCompleted;
      } finally {
        lessonCompleteButton.disabled = false;
        render();
      }
    });
  }

  if (chartProofButton && chartProofInput) {
    chartProofButton.addEventListener('click', () => {
      if (chartProofButton.disabled) return;
      chartProofInput.click();
    });

    chartProofInput.addEventListener('change', () => {
      chartCount = Math.min(requiredExamples, chartProofInput.files ? chartProofInput.files.length : 0);
      writeChartState();
      render();
    });
  }

  render();
})();

/* ---------- Before / After image comparison slider ---------- */
(function compareSlider() {
  const slider = document.getElementById('compareSlider');
  if (!slider) return;
  const top     = document.getElementById('compareTop');
  const divider = document.getElementById('compareDivider');
  const handle  = document.getElementById('compareHandle');

  let dragging = false;
  let currentPct = 50;

  function setPosition(percent) {
    percent = Math.max(0, Math.min(100, percent));
    currentPct = percent;
    const inset = 100 - percent;
    top.style.clipPath = `inset(0 ${inset}% 0 0)`;
    top.style.webkitClipPath = `inset(0 ${inset}% 0 0)`;
    divider.style.left = percent + '%';
    handle.style.left  = percent + '%';
  }

  function move(e) {
    if (!dragging) return;
    const rect = slider.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const x = cx - rect.left;
    const pct = (x / rect.width) * 100;
    setPosition(pct);
  }

  function start(e) {
    dragging = true;
    slider.classList.add('dragging');
    move(e);
    e.preventDefault();
  }

  function stop() {
    dragging = false;
    slider.classList.remove('dragging');
  }

  // Mouse
  handle.addEventListener('mousedown', start);
  slider.addEventListener('mousedown', start);
  window.addEventListener('mousemove', move);
  window.addEventListener('mouseup', stop);

  // Touch
  handle.addEventListener('touchstart', start, { passive: false });
  slider.addEventListener('touchstart', start, { passive: false });
  window.addEventListener('touchmove', move, { passive: false });
  window.addEventListener('touchend', stop);

  // Keyboard accessibility
  handle.setAttribute('tabindex', '0');
  handle.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  setPosition(currentPct - 2);
    if (e.key === 'ArrowRight') setPosition(currentPct + 2);
  });

  // Initial position
  setPosition(50);

  // Detect when either image fails — fallback message handled by CSS via parent class
  slider.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => slider.classList.add('img-missing'));
  });

  // Subtle auto demo wiggle once on load (so users notice it's interactive)
  let demoDone = false;
  const demo = () => {
    if (demoDone) return;
    demoDone = true;
    const steps = [50, 32, 68, 50];
    let i = 0;
    const tick = () => {
      if (i >= steps.length) return;
      const from = currentPct;
      const to = steps[i++];
      const startTime = performance.now();
      const animate = (now) => {
        const t = Math.min(1, (now - startTime) / 700);
        const eased = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2;
        setPosition(from + (to - from) * eased);
        if (t < 1) requestAnimationFrame(animate);
        else setTimeout(tick, 200);
      };
      requestAnimationFrame(animate);
    };
    tick();
  };
  // Trigger demo when slider scrolls into view
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { demo(); io.disconnect(); } });
    }, { threshold: 0.4 });
    io.observe(slider);
  } else {
    setTimeout(demo, 800);
  }
})();

/* ---------- Curriculum module data (bilingual) ---------- */
const modulesByLang = {
  nl: {
    1: { week: 'Week 01', title: 'Fundamenten — DR / IDR Anatomie', tag: 'Fundament',
         desc: 'Bouw de lens. We herbedraden hoe je een sessie ziet — niet als willekeurige candles, maar als een gestructureerd leveringsvenster met bias en referentiepunten.',
         lessons: ['De 3 sessies van een handelsdag (ADR · ODR · RDR)','High / Low / Close anatomie van een defining range','Implied vs. bevestigde ranges — wanneer welke geldt','Praktisch: je eerste 10 sessies in kaart brengen'],
         out: 'Je identificeert de DR & IDR op elke sessie binnen 30 seconden.' },
    2: { week: 'Week 02', title: 'Sessie timing & STDV projecties', tag: 'Fundament',
         desc: 'Tijd is de helft van het voordeel. Leer hoe het algoritme standaarddeviatie-extensies van de DR gebruikt om de dagelijkse reikwijdte te bepalen.',
         lessons: ['±0.5 / ±1 / ±1.5 / ±2 STDV doel-niveaus','Wanneer STDVs houden vs. wanneer ze falen','STDVs combineren met de close-bevestigingsregel','TradingView template setup — automatisch plotten'],
         out: 'Dagelijkse doelen worden objectief. Geen "even kijken hoe ver het gaat" meer.' },
    3: { week: 'Week 03', title: 'Liquiditeit & marktstructuur fundamenten', tag: 'Fundament',
         desc: 'Waarom reikt prijs naar sommige highs en wijst andere af? Liquiditeit is het antwoord. We brengen het helder in kaart.',
         lessons: ['Externe vs. interne liquiditeitspoelen','Gelijke highs / lows en het magneeteffect','Stop runs vs. echte breakouts','Structuur lezen op HTF + LTF confluence'],
         out: 'Lees waar prijs *naartoe wil* voordat het er is.' },
    4: { week: 'Week 04', title: 'Omega Sequence — Fases 1–3', tag: 'Core',
         desc: 'De Sequence begint. Drie fundamentele fases die elke algoritmische leveringscyclus definiëren.',
         lessons: ['Fase 1 — Liquidity engineering','Fase 2 — Displacement & energie-injectie','Fase 3 — Rebalance & retracement venster','Geannoteerde 1:1 voorbeelden op NQ, ES & EURUSD'],
         out: 'Herken de eerste drie fases op een live chart in realtime.' },
    5: { week: 'Week 05', title: 'Omega Sequence — Fases 4–7', tag: 'Core',
         desc: 'De expansie en resolutie van de Sequence — inclusief de eigen "Terminus Regel" die het einde van de cyclus definieert.',
         lessons: ['Fase 4 — Expansie leg','Fase 5 — Continuation logica','Fase 6 — Pre-terminus uitputting','Fase 7 — Terminus & reset'],
         out: 'Je hebt nu een complete kaart van hoe een handelscyclus geleverd wordt.' },
    6: { week: 'Week 06', title: 'Executiemodel & risicoframework', tag: 'Praktijk',
         desc: 'Een model is waardeloos zonder executie. We codificeren entries, stops, partiële exits en volledig risicobeheer.',
         lessons: ['Entry triggers — bevestiging vs. anticipatie','Stop plaatsing tegen structuur, niet willekeurige niveaus','Partiële scaling: 1R / 2R / runner logica','Dagelijkse / wekelijkse drawdown regels — prop firm safe'],
         out: 'Handel als een sluipschutter. Elke positie heeft een gedefinieerd plan.' },
    7: { week: 'Week 07', title: 'Backtesting & journaling — de Ω template', tag: 'Praktijk',
         desc: 'Je kunt geen model vertrouwen dat je niet hebt getest. Krijg de Omega journaal template en leer de workflow.',
         lessons: ['Backtest workflow — minimaal 100 trades','Statistisch voordeel: win rate · expectancy · drawdown','Bias-check kolom — elimineer emotionele entries','Bouw je persoonlijke A+ setup bibliotheek'],
         out: 'Vertrouwen onderbouwd door data, niet door gevoel.' },
    8: { week: 'Week 08', title: 'Live trading week + prop firm voorbereiding', tag: 'Praktijk',
         desc: 'We handelen de hele week live als cohort, en bereiden je voor om een funded challenge aan te gaan met een gestructureerd plan.',
         lessons: ['Live executie sessies bij elke NY open','Prop firm vergelijking — FTMO, Topstep, Apex, etc.','Challenge plan: fase 1 → fase 2 → funded','Diploma & levenslange cohort toegang'],
         out: 'Je vertrekt met een getest model, een plan, en het netwerk om op te schalen.' },
  },
  en: {
    1: { week: 'Week 01', title: 'Foundations — DR / IDR Anatomy', tag: 'Foundation',
         desc: 'Build the lens. We rewire how you see a session — not as random candles, but as a structured delivery window with bias and reference points.',
         lessons: ['The 3 sessions of a trading day (ADR · ODR · RDR)','High / Low / Close anatomy of a defining range','Implied vs. confirmed ranges — when each applies','Practical: marking up your first 10 sessions'],
         out: 'You will identify the DR & IDR on any session within 30 seconds.' },
    2: { week: 'Week 02', title: 'Session timing & STDV projections', tag: 'Foundation',
         desc: 'Time is half the edge. Learn how the algorithm uses standard deviation extensions of the DR to define daily reach.',
         lessons: ['±0.5 / ±1 / ±1.5 / ±2 STDV target tiers','When STDVs hold vs. when they fail','Pairing STDVs with the close confirmation rule','TradingView template setup — automated plotting'],
         out: 'Daily targets become objective. No more "let me see how far it goes."' },
    3: { week: 'Week 03', title: 'Liquidity & market structure foundations', tag: 'Foundation',
         desc: 'Why does price reach for some highs and reject others? Liquidity is the answer. We map it cleanly.',
         lessons: ['External vs. internal liquidity pools','Equal highs / lows and the magnet effect','Stop runs vs. genuine breakouts','Structure reads on HTF + LTF confluence'],
         out: 'Read where price *wants* to go before it gets there.' },
    4: { week: 'Week 04', title: 'Omega Sequence — Phases 1–3', tag: 'Core',
         desc: 'The Sequence begins. Three foundational phases that define every algorithmic delivery cycle.',
         lessons: ['Phase 1 — Liquidity engineering','Phase 2 — Displacement & energy injection','Phase 3 — Rebalance & retracement window','Annotated 1:1 examples on NQ, ES & EURUSD'],
         out: 'Spot the first three phases on a live chart in real time.' },
    5: { week: 'Week 05', title: 'Omega Sequence — Phases 4–7', tag: 'Core',
         desc: 'The expansion and resolution of the Sequence — including the proprietary "Terminus Rule" that defines the end of the cycle.',
         lessons: ['Phase 4 — Expansion leg','Phase 5 — Continuation logic','Phase 6 — Pre-terminus exhaustion','Phase 7 — Terminus & reset'],
         out: 'You now have a complete map of how a trading cycle delivers.' },
    6: { week: 'Week 06', title: 'Execution model & risk framework', tag: 'Practice',
         desc: 'A model is worthless without execution. We codify entries, stops, partial exits, and full risk management.',
         lessons: ['Entry triggers — confirmation vs. anticipation','Stop placement against structure, not random levels','Partial scaling: 1R / 2R / runner logic','Daily / weekly drawdown rules — prop firm safe'],
         out: 'Trade like a sniper. Every position has a defined plan.' },
    7: { week: 'Week 07', title: 'Backtesting & journaling — the Ω template', tag: 'Practice',
         desc: "You can't trust a model you haven't tested. Get the Omega journal template and learn the workflow.",
         lessons: ['Backtest workflow — 100 trades minimum','Statistical edge: win rate · expectancy · drawdown','Bias-check column — eliminate emotional entries','Building your personal A+ setup library'],
         out: 'Confidence backed by data, not vibes.' },
    8: { week: 'Week 08', title: 'Live trading week + prop firm prep', tag: 'Practice',
         desc: 'We trade live as a cohort all week, then prepare you to take a funded challenge with a structured plan.',
         lessons: ['Live execution sessions every NY open','Prop firm comparison — FTMO, Topstep, Apex, etc.','Challenge plan: phase 1 → phase 2 → funded','Graduation & lifetime cohort access'],
         out: 'You leave with a tested model, a plan, and the network to scale.' },
  }
};

/* Section labels used inside renderModule (translated) */
const moduleLabels = {
  nl: { inside: 'In deze week', outcome: 'Resultaat' },
  en: { inside: 'Inside this week', outcome: 'Outcome' }
};

let currentLang = (localStorage.getItem('lang') || 'nl');
let currentMod  = 1;

const modules = modulesByLang[currentLang];

const detail = document.getElementById('modDetail');
function renderModule(n) {
  currentMod = n;
  const data = modulesByLang[currentLang] || modulesByLang.nl;
  const labels = moduleLabels[currentLang] || moduleLabels.nl;
  const m = data[n];
  if (!m || !detail) return;
  detail.innerHTML = `
    <div class="flex items-center gap-3 mb-4">
      <span class="rounded-full border border-omega-400/40 bg-omega-500/10 text-omega-300 text-[10px] uppercase tracking-widest font-mono px-2.5 py-1">${m.tag}</span>
      <span class="font-mono text-xs text-white/40">${m.week}</span>
    </div>
    <h3 class="font-display text-2xl sm:text-3xl font-semibold">${m.title}</h3>
    <p class="mt-4 text-white/65 leading-relaxed">${m.desc}</p>
    <div class="mt-7">
      <div class="text-xs uppercase tracking-widest text-white/40 font-mono mb-3">${labels.inside}</div>
      <ul class="space-y-2.5 text-sm">
        ${m.lessons.map(l => `
          <li class="flex gap-3 text-white/80">
            <i data-lucide="chevron-right" class="h-4 w-4 text-omega-300 mt-0.5 shrink-0"></i>
            <span>${l}</span>
          </li>`).join('')}
      </ul>
    </div>
    <div class="mt-7 rounded-xl border border-omega-400/20 bg-omega-500/5 p-4">
      <div class="text-xs uppercase tracking-widest text-omega-300 font-mono">${labels.outcome}</div>
      <div class="text-sm text-white/85 mt-1">${m.out}</div>
    </div>
  `;
  lucide.createIcons();
}

const modBtns = document.querySelectorAll('.mod-btn');
modBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderModule(btn.dataset.mod);
  });
});
renderModule(1);

/* ---------- Language switcher (NL ↔ EN) ---------- */
const i18n = {
  nl: {
    'nav.curriculum': 'Curriculum',
    'nav.mentor': 'Mentor',
    'nav.pricing': 'Prijzen',
    'nav.faq': 'FAQ',
    'nav.enroll': 'Inschrijven',
    'nav.menu': 'Menu',
    'nav.login': 'Inloggen',
    'nav.logout': 'Uitloggen',
    'nav.dashboard': 'Dashboard',

    'hero.cohort': 'Cohort 04 — Inschrijving open',
    'hero.seats':  'Nog 37 plaatsen',
    'hero.headline': 'Handel met de <span class="relative inline-block whitespace-nowrap"><span class="bg-gradient-to-br from-omega-300 via-omega-400 to-omega-600 bg-clip-text text-transparent">Omega Sequence</span><svg class="absolute -bottom-3 left-0 w-full" viewBox="0 0 300 14" fill="none" preserveAspectRatio="none"><path d="M2 9C50 2 120 2 180 7C220 11 270 9 298 5" stroke="url(#og)" stroke-width="2.5" stroke-linecap="round"/><defs><linearGradient id="og" x1="0" y1="0" x2="300" y2="0"><stop stop-color="#4cf6b8"/><stop offset="1" stop-color="#009868"/></linearGradient></defs></svg></span><br />die de markten echt volgen.',
    'hero.sub': 'Een exclusieve mentorship die de <span class="text-white font-medium">Omega Sequence</span> aanleert naast <span class="text-white font-medium">DR / IDR fundamenten</span> — het algoritmische leveringsmodel dat precisie-traders gebruiken om tijd, range en intentie te lezen.',
    'hero.cta_primary': 'Reserveer je plek',
    'hero.cta_secondary': 'Bekijk curriculum',
    'hero.stat1': '<b class="text-white">1.240+</b> begeleide traders',
    'hero.stat2': '<b class="text-white">82%</b> bereikt prop funding',
    'hero.stat3': '<b class="text-white">8 weken</b> gestructureerd programma',

    'slider.drag': 'Sleep de slider',
    'slider.fallback1': 'Plaats je screenshots in <span class="font-mono text-omega-300">/assets</span>',
    'slider.fallback2': 'Sla ze op als <span class="font-mono text-white/80">chart-with.png</span> en <span class="font-mono text-white/80">chart-without.png</span> — de slider verschijnt direct.',
    'marquee.title': 'Studenten gefinancierd via',

    'learn.eyebrow': 'Wat je leert beheersen',
    'learn.title':   'Twee frameworks. <br /><span class="text-white/40">Eén precies voordeel.</span>',
    'learn.sub':     'Je hebt geen 50 indicatoren nodig. Je hebt een model nodig van hoe prijs daadwerkelijk geleverd wordt. De mentorship is gebouwd rond twee pijlers — en ze versterken elkaar.',

    'dridr.tag':   'Module 01 · Fundament',
    'dridr.title': 'DR / IDR Fundamenten',
    'dridr.desc':  'Leer de Defining Range en Implied Defining Range — het tijd-gebaseerde liquiditeitsmodel dat elke sessie kadert. Identificeer high / low / close gedrag met chirurgische helderheid.',
    'dridr.b1': 'Het lezen van de 09:30–10:30 DR en de 03:00 / 08:00 IDR sessies',
    'dridr.b2': 'Standaarddeviatie projecties (±0.5, ±1, ±1.5, ±2)',
    'dridr.b3': 'Bevestigingscandles, liquidity sweeps & invalidaties',
    'dridr.b4': 'Indicator setup — TradingView template inbegrepen',

    'omega.tag':   'Module 02–08 · Het Voordeel',
    'omega.title': 'De Omega Sequence',
    'omega.desc':  'Een 7-stappen algoritmisch leveringsframework dat in kaart brengt hoe institutionele prijs beweegt: <span class="text-white">liquiditeit → displacement → rebalance → expansion → continuation → terminus</span>. Lees intentie voordat het geprint wordt.',
    'omega.b1': 'De 7 fases van de Sequence — 1:1 geannoteerd',
    'omega.b2': 'Tijd + prijs confluence met het DR / IDR model',
    'omega.b3': 'SMT, ICT power-of-3, en Omega\'s eigen "terminus rule"',
    'omega.b4': 'Live executie playbook voor indices, FX en crypto',
    'omega.b5': 'Backtested journaal + bias-check template',

    'feat1.t': 'Live sessies',
    'feat1.d': '3× wekelijkse live trading & breakdown sessies tijdens NY open.',
    'feat2.t': 'Privé Discord',
    'feat2.d': 'Setups, journaals en 1-op-1 chart reviews van mentoren.',
    'feat3.t': 'Ω Indicator',
    'feat3.d': 'Aangepaste TradingView indicator die DR, IDR & Sequence fases plot.',
    'feat4.t': 'Levenslange toegang',
    'feat4.d': 'Bekijk alles opnieuw, neem deel aan elke toekomstige cohort — voor altijd.',

    'curr.eyebrow': 'Het pad',
    'curr.title':   '8-weken curriculum',
    'curr.sub':     'Gestructureerde progressie van nul tot confluence lezen. Elke week bouwt voort op de vorige.',
    'wk1': 'Fundamenten — DR / IDR Anatomie',
    'wk2': 'Sessie timing & STDV projecties',
    'wk3': 'Liquiditeit & marktstructuur fundamenten',
    'wk4': 'Omega Sequence — Fases 1–3',
    'wk5': 'Omega Sequence — Fases 4–7',
    'wk6': 'Executiemodel & risicoframework',
    'wk7': 'Backtesting & journaling — de Ω template',
    'wk8': 'Live trading week + prop firm voorbereiding',

    'mentor.badge':   'Jouw mentor',
    'mentor.name':    'Mentor Gio',
    'mentor.meta':    '7+ jaar · 12.000+ trades gelogd',
    'mentor.eyebrow': 'Maak kennis met Gio',
    'mentor.title':   'Gegeven door een trader<br/>die echt handelt.',
    'mentor.bio':     'Omega Sequence wordt geleid door <span class="text-white font-medium">Gio</span> — een voormalig prop trader die het framework bouwde na 7 jaar het ontleden van algoritmische levering op indices en FX. Elk concept dat wordt onderwezen, gebruikt hij in zijn eigen live executie — niets gerecycled, niets theoretisch.',
    'mentor.s1': 'Jaren in markten',
    'mentor.s2': 'Funded kapitaal',
    'mentor.s3': '1-op-1 begeleid',
    'mentor.tag2': "FX Hoofdvaluta's",

    'test.eyebrow': 'Studentresultaten',
    'test.title':   'Gebaseerd op bewijs.',
    't1.quote': '"Alleen de DR / IDR module liet me al 3 jaar slechte gewoontes afleren. Toen leerde de Sequence me intentie te lezen. Funded met FTMO in week 6."',
    't2.quote': '"Ik had drie andere mentorships gevolgd voor deze. Omega is de enige die tijd, range en structuur verbindt in één beslisboom."',
    't3.quote': '"De indicator is goud waard. Plotte fases op mijn charts en plots werd de ruis een signaal. Mijn win rate steeg van 41% naar 67%."',

    'price.eyebrow':   'Inschrijving',
    'price.title':     'Kies je pad',
    'price.sub':       'Twee manieren binnen. Hetzelfde voordeel.',
    'price.popular':   'Meest gekozen',
    'price.pro_sub':   'De volledige mentorship',
    'price.month':     '/ maand',
    'price.pro_meta':  'Altijd opzegbaar · Levenslange toegang tot materiaal',
    'price.pro_b1':    'Volledige DR / IDR fundament modules',
    'price.pro_b2':    'Alle 7 Omega Sequence fases',
    'price.pro_b3':    'Pro Ω TradingView indicator',
    'price.pro_b4':    '3× wekelijkse live sessies (8 weken)',
    'price.pro_b5':    'Backtesting journaal template',
    'price.pro_b6':    'Prop firm voorbereiding & funded plan',
    'price.pro_b7':    'Privé Discord community',
    'price.pro_cta':   'Schrijf in voor Pro',
    'price.elite_name':'Elite 1-op-1',
    'price.elite_sub': 'Privé mentorship',
    'price.onetime':   'eenmalig',
    'price.elite_b1':  'Alles in Omega Pro',
    'price.elite_b2':  '8× privé 1-op-1 sessies',
    'price.elite_b3':  'Wekelijkse persoonlijke chart reviews',
    'price.elite_b4':  'Directe WhatsApp lijn',
    'price.elite_b5':  'Funded challenge sponsoring',
    'price.elite_cta': 'Aanvragen',
    'price.refund':    '<i data-lucide="shield-check" class="inline h-4 w-4 mr-1 -mt-1"></i> 14 dagen geld terug · Geen vragen gesteld',

    'faq.title': 'Veelgestelde vragen',
    'faq.q1': 'Heb ik voorafgaande trading ervaring nodig?',
    'faq.a1': 'Nee. De DR / IDR module begint vanaf de absolute basis. Als je een candle kunt lezen, kun je starten. Pro Omega Sequence gaat ervan uit dat je het fundament hebt afgerond, wat inbegrepen is.',
    'faq.q2': 'Op welke markten werkt het?',
    'faq.a2': "De Omega Sequence is asset-agnostisch. We focussen voornamelijk op indices (NQ, ES), FX hoofdvaluta's, en BTC/ETH — maar dezelfde logica geldt voor elke liquide markt.",
    'faq.q3': 'Hoeveel tijd per week?',
    'faq.a3': 'Reken op 4–6 uur per week: 1 live sessie (opgenomen indien gemist), 1 backtesting blok, plus async lessen. De hele cohort duurt 8 weken.',
    'faq.q4': 'Wordt de indicator apart betaald?',
    'faq.a4': 'Beide indicatoren zijn inbegrepen bij hun respectievelijke pakketten — geen extra abonnement. De Pro Ω indicator plot DR, IDR, STDV niveaus en de 7 Sequence fases live.',
    'faq.q5': 'Is dit gewoon ICT in nieuwe verpakking?',
    'faq.a5': 'Nee. De Sequence ontleent de algoritmische lens van de ICT methodologie, maar het 7-fase framework, de terminus regel en de integratie met DR / IDR timing zijn origineel van Omega. Schoon, gecodificeerd en testbaar.',
    'faq.q6': 'Refundbeleid?',
    'faq.a6': '14 dagen, volledige terugbetaling, geen vragen gesteld. Als het programma niets voor je is, stuur dan gewoon een e-mail — we houden het simpel.',

    'cta.title':     'Stop met gokken.<br/>Begin met <span class="bg-gradient-to-br from-omega-300 to-omega-500 bg-clip-text text-transparent">het lezen van het algoritme.</span>',
    'cta.sub':       'Cohort 04 start over 6 dagen. Zodra de plaatsen vol zijn, opent de volgende over drie maanden.',
    'cta.primary':   'Schrijf je nu in',
    'cta.secondary': 'Bekijk volledig curriculum',

    'footer.copy': "© 2026 Omega Sequence. Trading brengt risico's met zich mee. Resultaten uit het verleden zijn geen garantie voor de toekomst.",

    'cookie.title':     'We respecteren je privacy',
    'cookie.body':      'We gebruiken alleen essentiële cookies om de site te laten werken. Met jouw toestemming gebruiken we anonieme analyses om de site te verbeteren. Je keuze is op elk moment in te trekken.',
    'cookie.necessary': 'Alleen noodzakelijk',
    'cookie.accept':    'Alles accepteren'
  },
  en: {
    'nav.curriculum': 'Curriculum',
    'nav.mentor': 'Mentor',
    'nav.pricing': 'Pricing',
    'nav.faq': 'FAQ',
    'nav.enroll': 'Enroll',
    'nav.menu': 'Menu',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.dashboard': 'Dashboard',

    'hero.cohort': 'Cohort 04 — Enrollment open',
    'hero.seats':  '37 seats left',
    'hero.headline': 'Trade with the <span class="relative inline-block whitespace-nowrap"><span class="bg-gradient-to-br from-omega-300 via-omega-400 to-omega-600 bg-clip-text text-transparent">Omega Sequence</span><svg class="absolute -bottom-3 left-0 w-full" viewBox="0 0 300 14" fill="none" preserveAspectRatio="none"><path d="M2 9C50 2 120 2 180 7C220 11 270 9 298 5" stroke="url(#og)" stroke-width="2.5" stroke-linecap="round"/><defs><linearGradient id="og" x1="0" y1="0" x2="300" y2="0"><stop stop-color="#4cf6b8"/><stop offset="1" stop-color="#009868"/></linearGradient></defs></svg></span><br />the markets actually follow.',
    'hero.sub': 'A private mentorship teaching the <span class="text-white font-medium">Omega Sequence</span> alongside <span class="text-white font-medium">DR / IDR fundamentals</span> — the algorithmic delivery model used by precision traders to read time, range, and intent.',
    'hero.cta_primary': 'Claim your seat',
    'hero.cta_secondary': 'Preview curriculum',
    'hero.stat1': '<b class="text-white">1,240+</b> mentored traders',
    'hero.stat2': '<b class="text-white">82%</b> reach prop funded',
    'hero.stat3': '<b class="text-white">8 weeks</b> structured program',

    'slider.drag': 'Drag the slider',
    'slider.fallback1': 'Drop your screenshots in <span class="font-mono text-omega-300">/assets</span>',
    'slider.fallback2': 'Save them as <span class="font-mono text-white/80">chart-with.png</span> and <span class="font-mono text-white/80">chart-without.png</span> — the slider will appear instantly.',
    'marquee.title': 'Students funded across',

    'learn.eyebrow': "What you'll master",
    'learn.title':   'Two frameworks. <br /><span class="text-white/40">One precise edge.</span>',
    'learn.sub':     "You don't need 50 indicators. You need a model of how price actually delivers. The mentorship is built around two pillars — and they reinforce each other.",

    'dridr.tag':   'Module 01 · Foundation',
    'dridr.title': 'DR / IDR Fundamentals',
    'dridr.desc':  'Learn the Defining Range and Implied Defining Range — the time-based liquidity model that frames every session. Identify high / low / close behavior with surgical clarity.',
    'dridr.b1': 'Reading the 09:30–10:30 DR and the 03:00 / 08:00 IDR sessions',
    'dridr.b2': 'Standard deviation projections (±0.5, ±1, ±1.5, ±2)',
    'dridr.b3': 'Confirmation candles, liquidity sweeps & invalidations',
    'dridr.b4': 'Indicator setup — TradingView template included',

    'omega.tag':   'Module 02–08 · The Edge',
    'omega.title': 'The Omega Sequence',
    'omega.desc':  'A 7-step algorithmic delivery framework that maps how institutional price moves: <span class="text-white">liquidity → displacement → rebalance → expansion → continuation → terminus</span>. Read intent before it prints.',
    'omega.b1': 'The 7 phases of the Sequence — annotated 1:1',
    'omega.b2': 'Time + price confluence with the DR / IDR model',
    'omega.b3': 'SMT, ICT power-of-3, and Omega\'s proprietary "terminus rule"',
    'omega.b4': 'Live execution playbook for indices, FX and crypto',
    'omega.b5': 'Backtested journal + bias-check template',

    'feat1.t': 'Live sessions',
    'feat1.d': '3× weekly live trading & breakdown calls during NY open.',
    'feat2.t': 'Private Discord',
    'feat2.d': 'Setups, journals, and 1-on-1 chart reviews from mentors.',
    'feat3.t': 'Ω Indicator',
    'feat3.d': 'Custom TradingView indicator that plots DR, IDR & Sequence phases.',
    'feat4.t': 'Lifetime access',
    'feat4.d': 'Replay everything, attend any future cohort — forever.',

    'curr.eyebrow': 'The path',
    'curr.title':   '8-week curriculum',
    'curr.sub':     'Structured progression from zero to confluence reading. Each week builds on the last.',
    'wk1': 'Foundations — DR / IDR Anatomy',
    'wk2': 'Session timing & STDV projections',
    'wk3': 'Liquidity & market structure foundations',
    'wk4': 'Omega Sequence — Phases 1–3',
    'wk5': 'Omega Sequence — Phases 4–7',
    'wk6': 'Execution model & risk framework',
    'wk7': 'Backtesting & journaling — the Ω template',
    'wk8': 'Live trading week + prop firm prep',

    'mentor.badge':   'Your mentor',
    'mentor.name':    'Mentor Gio',
    'mentor.meta':    '7+ years · 12,000+ trades logged',
    'mentor.eyebrow': 'Meet Gio',
    'mentor.title':   'Taught by a trader<br/>who actually trades.',
    'mentor.bio':     'Omega Sequence is led by <span class="text-white font-medium">Gio</span> — a former prop trader who built the framework after 7 years of dissecting algorithmic delivery on indices and FX. Every concept taught is one used in his own live execution — nothing recycled, nothing theoretical.',
    'mentor.s1': 'Years in markets',
    'mentor.s2': 'Funded capital',
    'mentor.s3': 'Mentored 1-on-1',
    'mentor.tag2': 'FX Majors',

    'test.eyebrow': 'Student results',
    'test.title':   'Built on receipts.',
    't1.quote': '"The DR / IDR module alone made me unlearn 3 years of bad habits. Then the Sequence taught me to read intent. Funded with FTMO in week 6."',
    't2.quote': '"I\'d taken three other mentorships before this. Omega is the only one that connects time, range, and structure into a single decision tree."',
    't3.quote': '"The indicator is gold. Plotted phases on my charts and suddenly the noise became signal. My win rate jumped from 41% to 67%."',

    'price.eyebrow':   'Enrollment',
    'price.title':     'Pick your path',
    'price.sub':       'Two ways in. Same edge.',
    'price.popular':   'Most popular',
    'price.pro_sub':   'The full mentorship',
    'price.month':     '/ month',
    'price.pro_meta':  'Cancel anytime · Lifetime materials access',
    'price.pro_b1':    'Full DR / IDR foundation modules',
    'price.pro_b2':    'All 7 Omega Sequence phases',
    'price.pro_b3':    'Pro Ω TradingView indicator',
    'price.pro_b4':    '3× weekly live sessions (8 weeks)',
    'price.pro_b5':    'Backtesting journal template',
    'price.pro_b6':    'Prop firm prep & funded plan',
    'price.pro_b7':    'Private Discord community',
    'price.pro_cta':   'Enroll in Pro',
    'price.elite_name':'Elite 1-on-1',
    'price.elite_sub': 'Private mentorship',
    'price.onetime':   'one-time',
    'price.elite_b1':  'Everything in Omega Pro',
    'price.elite_b2':  '8× private 1-on-1 calls',
    'price.elite_b3':  'Personal chart reviews weekly',
    'price.elite_b4':  'Direct WhatsApp line',
    'price.elite_b5':  'Funded challenge sponsorship',
    'price.elite_cta': 'Apply',
    'price.refund':    '<i data-lucide="shield-check" class="inline h-4 w-4 mr-1 -mt-1"></i> 14-day refund · No questions asked',

    'faq.title': 'Common questions',
    'faq.q1': 'Do I need prior trading experience?',
    'faq.a1': "No. The DR / IDR module starts from absolute first principles. If you can read a candle, you can start. Pro Omega Sequence assumes you've completed the foundation, which is included.",
    'faq.q2': 'What markets does it work on?',
    'faq.a2': 'The Omega Sequence is asset-agnostic. We focus primarily on indices (NQ, ES), FX majors, and BTC/ETH — but the same logic applies to any liquid market.',
    'faq.q3': 'How much time per week?',
    'faq.a3': 'Plan for 4–6 hours per week: 1 live session (recorded if missed), 1 backtesting block, plus async lessons. The whole cohort runs 8 weeks.',
    'faq.q4': 'Is the indicator paid separately?',
    'faq.a4': 'Both indicators are included with their respective tiers — no extra subscription. The Pro Ω indicator plots DR, IDR, STDV levels and the 7 Sequence phases live.',
    'faq.q5': 'Is this just ICT repackaged?',
    'faq.a5': "No. The Sequence borrows the lens of algorithmic delivery from ICT methodology, but the 7-phase framework, terminus rule, and integration with DR / IDR timing are original to Omega. Clean, codified, and testable.",
    'faq.q6': 'Refund policy?',
    'faq.a6': "14 days, full refund, no questions. If the program isn't for you, just email — we keep it simple.",

    'cta.title':     'Stop guessing.<br/>Start <span class="bg-gradient-to-br from-omega-300 to-omega-500 bg-clip-text text-transparent">reading the algorithm.</span>',
    'cta.sub':       'Cohort 04 begins in 6 days. Once seats close, the next one opens in three months.',
    'cta.primary':   'Enroll now',
    'cta.secondary': 'See full curriculum',

    'footer.copy': '© 2026 Omega Sequence. Trading involves risk. Past performance is not indicative of future results.',

    'cookie.title':     'We respect your privacy',
    'cookie.body':      'We only use essential cookies to make the site work. With your consent we use anonymous analytics to improve it. You can withdraw your choice at any time.',
    'cookie.necessary': 'Necessary only',
    'cookie.accept':    'Accept all'
  }
};

const LANG_META = {
  nl: { flag: 'fi-nl', code: 'NL' },
  en: { flag: 'fi-gb', code: 'EN' },
};

function syncLangTrigger(lang) {
  const flag = document.getElementById('langToggleFlag');
  const lbl  = document.getElementById('langToggleLabel');
  if (flag) flag.className = 'fi ' + LANG_META[lang].flag + ' rounded-[2px] !h-3.5 !w-5';
  if (lbl)  lbl.textContent = LANG_META[lang].code;
  document.querySelectorAll('.lang-option').forEach(opt => {
    const check = opt.querySelector('.lang-check');
    if (!check) return;
    if (opt.dataset.lang === lang) check.classList.remove('invisible');
    else check.classList.add('invisible');
  });
}

function setLang(lang) {
  if (!i18n[lang]) return;
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = i18n[lang][key];
    if (val === undefined) return;
    el.innerHTML = val;
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    const key = el.dataset.i18nAriaLabel;
    const val = i18n[lang][key];
    if (val === undefined) return;
    el.setAttribute('aria-label', val.replace(/<[^>]*>/g, ''));
  });
  // Re-render the currently active curriculum module in the new language
  if (typeof renderModule === 'function') renderModule(currentMod);
  // Re-init Lucide icons (some HTML strings include <i data-lucide>)
  if (window.lucide) lucide.createIcons();
  // Sync the dropdown trigger (flag + code + check-mark)
  syncLangTrigger(lang);
  localStorage.setItem('lang', lang);
}

(function bindLangDropdown() {
  const switcher = document.getElementById('langSwitcher');
  const btn      = document.getElementById('langToggle');
  const menu     = document.getElementById('langMenu');
  const chevron  = document.getElementById('langToggleChevron');
  if (!switcher || !btn || !menu) return;

  function open() {
    menu.classList.remove('hidden');
    btn.setAttribute('aria-expanded', 'true');
    if (chevron) chevron.style.transform = 'rotate(180deg)';
  }
  function close() {
    menu.classList.add('hidden');
    btn.setAttribute('aria-expanded', 'false');
    if (chevron) chevron.style.transform = '';
  }
  function toggle() {
    if (menu.classList.contains('hidden')) open();
    else close();
  }

  btn.addEventListener('click', e => { e.stopPropagation(); toggle(); });

  menu.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', e => {
      e.stopPropagation();
      setLang(opt.dataset.lang);
      close();
    });
  });

  // Close on outside click or Escape
  document.addEventListener('click', e => {
    if (!switcher.contains(e.target)) close();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });

  // Apply persisted choice on load. HTML defaults to Dutch, so only do the
  // full translation pass when the saved choice is English. Otherwise just sync
  // the trigger UI so the flag/code/check matches the visible Dutch content.
  if (currentLang === 'en') {
    setLang('en');
  } else {
    syncLangTrigger('nl');
  }
})();

/* ---------- Smooth anchor offset for sticky header ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});
