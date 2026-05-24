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
  if (window.scrollY > 20) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

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
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
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

/* ---------- Curriculum module switcher ---------- */
const modules = {
  1: {
    week: 'Week 01',
    title: 'Foundations — DR / IDR Anatomy',
    tag: 'Foundation',
    desc: 'Build the lens. We rewire how you see a session — not as random candles, but as a structured delivery window with bias and reference points.',
    lessons: [
      'The 3 sessions of a trading day (ADR · ODR · RDR)',
      'High / Low / Close anatomy of a defining range',
      'Implied vs. confirmed ranges — when each applies',
      'Practical: marking up your first 10 sessions',
    ],
    out: 'You will identify the DR & IDR on any session within 30 seconds.',
  },
  2: {
    week: 'Week 02',
    title: 'Session timing & STDV projections',
    tag: 'Foundation',
    desc: 'Time is half the edge. Learn how the algorithm uses standard deviation extensions of the DR to define daily reach.',
    lessons: [
      '±0.5 / ±1 / ±1.5 / ±2 STDV target tiers',
      'When STDVs hold vs. when they fail',
      'Pairing STDVs with the close confirmation rule',
      'TradingView template setup — automated plotting',
    ],
    out: 'Daily targets become objective. No more "let me see how far it goes."',
  },
  3: {
    week: 'Week 03',
    title: 'Liquidity & market structure foundations',
    tag: 'Foundation',
    desc: 'Why does price reach for some highs and reject others? Liquidity is the answer. We map it cleanly.',
    lessons: [
      'External vs. internal liquidity pools',
      'Equal highs / lows and the magnet effect',
      'Stop runs vs. genuine breakouts',
      'Structure reads on HTF + LTF confluence',
    ],
    out: 'Read where price *wants* to go before it gets there.',
  },
  4: {
    week: 'Week 04',
    title: 'Omega Sequence — Phases 1–3',
    tag: 'Core',
    desc: 'The Sequence begins. Three foundational phases that define every algorithmic delivery cycle.',
    lessons: [
      'Phase 1 — Liquidity engineering',
      'Phase 2 — Displacement & energy injection',
      'Phase 3 — Rebalance & retracement window',
      'Annotated 1:1 examples on NQ, ES & EURUSD',
    ],
    out: 'Spot the first three phases on a live chart in real time.',
  },
  5: {
    week: 'Week 05',
    title: 'Omega Sequence — Phases 4–7',
    tag: 'Core',
    desc: 'The expansion and resolution of the Sequence — including the proprietary "Terminus Rule" that defines the end of the cycle.',
    lessons: [
      'Phase 4 — Expansion leg',
      'Phase 5 — Continuation logic',
      'Phase 6 — Pre-terminus exhaustion',
      'Phase 7 — Terminus & reset',
    ],
    out: 'You now have a complete map of how a trading cycle delivers.',
  },
  6: {
    week: 'Week 06',
    title: 'Execution model & risk framework',
    tag: 'Practice',
    desc: 'A model is worthless without execution. We codify entries, stops, partial exits, and full risk management.',
    lessons: [
      'Entry triggers — confirmation vs. anticipation',
      'Stop placement against structure, not random levels',
      'Partial scaling: 1R / 2R / runner logic',
      'Daily / weekly drawdown rules — prop firm safe',
    ],
    out: 'Trade like a sniper. Every position has a defined plan.',
  },
  7: {
    week: 'Week 07',
    title: 'Backtesting & journaling — the Ω template',
    tag: 'Practice',
    desc: 'You can\'t trust a model you haven\'t tested. Get the Omega journal template and learn the workflow.',
    lessons: [
      'Backtest workflow — 100 trades minimum',
      'Statistical edge: win rate · expectancy · drawdown',
      'Bias-check column — eliminate emotional entries',
      'Building your personal A+ setup library',
    ],
    out: 'Confidence backed by data, not vibes.',
  },
  8: {
    week: 'Week 08',
    title: 'Live trading week + prop firm prep',
    tag: 'Practice',
    desc: 'We trade live as a cohort all week, then prepare you to take a funded challenge with a structured plan.',
    lessons: [
      'Live execution sessions every NY open',
      'Prop firm comparison — FTMO, Topstep, Apex, etc.',
      'Challenge plan: phase 1 → phase 2 → funded',
      'Graduation & lifetime cohort access',
    ],
    out: 'You leave with a tested model, a plan, and the network to scale.',
  },
};

const detail = document.getElementById('modDetail');
function renderModule(n) {
  const m = modules[n];
  if (!m || !detail) return;
  detail.innerHTML = `
    <div class="flex items-center gap-3 mb-4">
      <span class="rounded-full border border-omega-400/40 bg-omega-500/10 text-omega-300 text-[10px] uppercase tracking-widest font-mono px-2.5 py-1">${m.tag}</span>
      <span class="font-mono text-xs text-white/40">${m.week}</span>
    </div>
    <h3 class="font-display text-2xl sm:text-3xl font-semibold">${m.title}</h3>
    <p class="mt-4 text-white/65 leading-relaxed">${m.desc}</p>
    <div class="mt-7">
      <div class="text-xs uppercase tracking-widest text-white/40 font-mono mb-3">Inside this week</div>
      <ul class="space-y-2.5 text-sm">
        ${m.lessons.map(l => `
          <li class="flex gap-3 text-white/80">
            <i data-lucide="chevron-right" class="h-4 w-4 text-omega-300 mt-0.5 shrink-0"></i>
            <span>${l}</span>
          </li>`).join('')}
      </ul>
    </div>
    <div class="mt-7 rounded-xl border border-omega-400/20 bg-omega-500/5 p-4">
      <div class="text-xs uppercase tracking-widest text-omega-300 font-mono">Outcome</div>
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
