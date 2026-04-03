/* =============================================================
   GOLDEN SUNFLOWER — script.js
   Loading animation, typing effect, scroll effects, mobile nav,
   dark/light/solar-eclipse/golden-hour theme toggle
   ============================================================= */

(function () {
  'use strict';

  /* ── Theme Toggle ──────────────────────────────────────────── */
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;

  const THEMES = ['dark', 'light', 'solar-eclipse', 'golden-hour'];

  // Helper: normalize to a known theme and keep the toggle button's
  // aria-pressed state in sync. Pass persist=true only on user interaction
  // so first-time visitors don't get localStorage written on load.
  function applyTheme(theme, persist) {
    // Coerce to a known value; default to "dark" for any unexpected input.
    const normalized = THEMES.includes(theme) ? theme : 'dark';
    htmlEl.setAttribute('data-theme', normalized);
    if (themeToggle) {
      // aria-pressed="true" means the button is currently in "dark" state
      themeToggle.setAttribute('aria-pressed', normalized === 'dark' ? 'true' : 'false');
    }
    if (persist) {
      try { localStorage.setItem('gs-theme', normalized); } catch (e) {}
    }
  }

  // Sync the toggle button with whichever theme is already active on load
  // (set by either the HTML default or the inline <head> script).
  // Do NOT persist — only write localStorage in response to a user toggle.
  applyTheme(htmlEl.getAttribute('data-theme'), false);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const current = htmlEl.getAttribute('data-theme');
      const currentIndex = THEMES.indexOf(current);
      const nextIndex = currentIndex < 0
        ? (1 % THEMES.length)
        : ((currentIndex + 1) % THEMES.length);
      const next = THEMES[nextIndex];
      applyTheme(next, true);
    });
  }

  /* ── Digital Clock ─────────────────────────────────────────── */
  var navClock = document.getElementById('navClock');

  function updateClock() {
    var now = new Date();
    var h = String(now.getHours()).padStart(2, '0');
    var m = String(now.getMinutes()).padStart(2, '0');
    var s = String(now.getSeconds()).padStart(2, '0');
    navClock.textContent = h + ':' + m + ':' + s;
  }

  if (navClock) {
    updateClock();
    setInterval(updateClock, 1000);
  }

  /* ── Typing Effect ─────────────────────────────────────────── */
  var TYPING_DELAY_MS = 65;

  function startTypingEffect() {
    var taglineEl = document.querySelector('.hero-tagline');
    if (!taglineEl) return;

    var fullText = taglineEl.getAttribute('data-text') || taglineEl.textContent.trim();
    taglineEl.setAttribute('data-text', fullText);

    // Respect users who prefer reduced motion: skip typing animation and timers.
    var prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      taglineEl.textContent = fullText;
      return;
    }

    taglineEl.textContent = '';
    taglineEl.classList.add('typing-active');

    var i = 0;
    function typeNext() {
      if (i < fullText.length) {
        taglineEl.textContent += fullText[i++];
        setTimeout(typeNext, TYPING_DELAY_MS);
      } else {
        setTimeout(function () {
          taglineEl.classList.remove('typing-active');
        }, 800);
      }
    }
    typeNext();
  }

  /* ── Loading Screen ────────────────────────────────────────── */
  const loader      = document.getElementById('loader');
  const loaderBar   = document.getElementById('loaderBar');
  const loaderText  = document.getElementById('loaderText');
  const mainContent = document.getElementById('main-content');

  const loadingSteps = [
    { pct: 15,  msg: 'LOADING ASSETS...'   },
    { pct: 35,  msg: 'RENDERING UI...'     },
    { pct: 55,  msg: 'CHECKING MODULES...' },
    { pct: 75,  msg: 'CONNECTING...'       },
    { pct: 90,  msg: 'FINALISING...'       },
    { pct: 100, msg: 'SYSTEM READY!'       },
  ];

  let stepIndex = 0;

  function advanceLoader() {
    if (stepIndex >= loadingSteps.length) {
      // Hide loader and mark page content as no longer busy
      setTimeout(function () {
        loader.classList.add('hidden');
        if (mainContent) { mainContent.removeAttribute('aria-busy'); }
        // Trigger reveal animations and typing effect
        revealVisible();
        startTypingEffect();
      }, 300);
      return;
    }

    const step = loadingSteps[stepIndex++];
    loaderBar.style.width = step.pct + '%';
    loaderText.textContent = step.msg;
    setTimeout(advanceLoader, stepIndex < loadingSteps.length ? 280 : 500);
  }

  // Start loading sequence after a short delay
  setTimeout(advanceLoader, 200);

  /* ── Navbar scroll behaviour ───────────────────────────────── */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ── Mobile Navigation Toggle ──────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── Scroll-reveal ─────────────────────────────────────────── */
  // Add reveal class to animatable elements
  var revealTargets = document.querySelectorAll(
    '.talent-card, .industry-card, .section-header, .partners-text, .partners-visual'
  );

  revealTargets.forEach(function (el) {
    el.classList.add('reveal');
  });

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  function revealVisible() {
    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ── Active nav link on scroll ─────────────────────────────── */
  var sections = document.querySelectorAll('section[id], footer[id]');
  var navLinkEls = document.querySelectorAll('.nav-link');

  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinkEls.forEach(function (link) {
            var href = link.getAttribute('href');
            if (href === '#' + id) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  /* ── Smooth scroll polyfill for anchor links ─────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = anchor.getAttribute('href').slice(1);
      var target   = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      var navbarEl  = document.getElementById('navbar');
      var offset    = navbarEl ? navbarEl.offsetHeight : 0;
      var targetTop = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

}());
