/**
 * Global Critical Thinkers — script.js
 *
 * CSS handles every animation it can. JavaScript covers what it can't:
 *   1. Scroll progress thread fill
 *   2. Header scrolled state
 *   3. Section reveal via IntersectionObserver
 *   4. FAQ accordion
 *   5. Footer year
 */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1 & 2. Scroll progress thread + header scrolled state
     ------------------------------------------------------------------ */
  var progressFill = document.getElementById('progressFill');
  var siteHeader = document.getElementById('siteHeader');
  var ticking = false;

  function updateOnScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressFill) progressFill.style.height = Math.min(progress, 100) + '%';
    if (siteHeader) siteHeader.classList.toggle('is-scrolled', scrollTop > 40);

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }, { passive: true });

  updateOnScroll();

  /* ------------------------------------------------------------------
     3. Reveal on scroll
     ------------------------------------------------------------------ */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ------------------------------------------------------------------
     4. FAQ accordion
     ------------------------------------------------------------------ */
  document.querySelectorAll('.faq-item__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var wasOpen = item.classList.contains('is-open');

      item.parentElement.querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('is-open');
      });

      if (!wasOpen) item.classList.add('is-open');
    });
  });

  /* ------------------------------------------------------------------
     Trust section — Awards / Venue / FAQ card switcher
     ------------------------------------------------------------------ */
  var trustCards = document.querySelectorAll('.trust-nav__card');

  function activateTrustCard(target) {
    var card = document.querySelector('.trust-nav__card[data-target="' + target + '"]');
    if (!card) return;

    trustCards.forEach(function (c) {
      var isTarget = c === card;
      c.classList.toggle('is-active', isTarget);
      c.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    document.querySelectorAll('.trust-panel').forEach(function (panel) {
      var isTarget = panel.id === 'trust-panel-' + target;
      panel.classList.toggle('is-active', isTarget);
      panel.hidden = !isTarget;
    });
  }

  if (trustCards.length) {
    trustCards.forEach(function (card) {
      card.addEventListener('click', function () {
        var target = card.getAttribute('data-target');
        if (!target || card.classList.contains('is-active')) return;
        activateTrustCard(target);
      });
    });

    /* Deep links like #faq or #venue should open the matching card
       instead of landing on a hidden panel. */
    var deepLinkMap = { faq: 'faq', venue: 'venue', trust: 'awards' };
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      var hash = link.getAttribute('href').slice(1);
      if (deepLinkMap[hash]) {
        link.addEventListener('click', function () {
          activateTrustCard(deepLinkMap[hash]);
        });
      }
    });

    if (window.location.hash) {
      var initialHash = window.location.hash.slice(1);
      if (deepLinkMap[initialHash]) activateTrustCard(deepLinkMap[initialHash]);
    }
  }

  /* ------------------------------------------------------------------
     Mobile navigation toggle
     ------------------------------------------------------------------ */
  var navToggle = document.getElementById('navToggle');
  var navMobile = document.getElementById('navMobile');

  if (navToggle && navMobile) {
    var navTransitioning = false;

    function openNav() {
      siteHeader.classList.add('is-nav-open');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      siteHeader.classList.remove('is-nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
    }

    function isNavOpen() {
      return siteHeader.classList.contains('is-nav-open');
    }

    function lockToggle() {
      navTransitioning = true;
      window.setTimeout(function () { navTransitioning = false; }, 350);
    }

    navToggle.addEventListener('click', function () {
      if (navTransitioning) return;
      lockToggle();
      if (isNavOpen()) {
        closeNav();
      } else {
        openNav();
      }
    });

    navMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (navTransitioning) return;
        lockToggle();
        closeNav();
      });
    });

    /* Click outside the menu content (i.e. on the backdrop area of the
       full-screen panel itself, not on a link) closes the menu. */
    navMobile.addEventListener('click', function (event) {
      if (event.target === navMobile) {
        if (navTransitioning) return;
        lockToggle();
        closeNav();
      }
    });

    /* Click anywhere else on the page while the menu is open closes it. */
    document.addEventListener('click', function (event) {
      if (!isNavOpen()) return;
      if (navMobile.contains(event.target) || navToggle.contains(event.target)) return;
      if (navTransitioning) return;
      lockToggle();
      closeNav();
    });

    /* Escape key closes the menu. */
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isNavOpen()) {
        if (navTransitioning) return;
        lockToggle();
        closeNav();
      }
    });
  }

  /* ------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------ */
  var yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
