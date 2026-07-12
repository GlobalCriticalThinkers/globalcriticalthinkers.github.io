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
  var trustPanelsWrap = document.querySelector('.trust-panels');

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

    if (trustPanelsWrap) trustPanelsWrap.classList.add('has-selection');
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
     Mobile navigation toggle — floating dropdown panel
     ------------------------------------------------------------------ */
  var navToggle = document.getElementById('navToggle');
  var navMobile = document.getElementById('navMobile');
  var navPop = navToggle ? navToggle.closest('.nav-pop') : null;

  if (navToggle && navMobile && navPop) {
    var navTransitioning = false;

    function isNavOpen() {
      return navPop.classList.contains('is-open');
    }

    function openNav() {
      navPop.classList.add('is-open');
      siteHeader.classList.add('is-nav-open');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Close menu');
    }

    function closeNav() {
      navPop.classList.remove('is-open');
      siteHeader.classList.remove('is-nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
    }

    function lockToggle() {
      navTransitioning = true;
      window.setTimeout(function () { navTransitioning = false; }, 250);
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
        closeNav();
      });
    });

    /* Click anywhere outside the panel and its trigger closes it. */
    document.addEventListener('click', function (event) {
      if (!isNavOpen()) return;
      if (navPop.contains(event.target)) return;
      closeNav();
    });

    /* Escape key closes the panel and returns focus to the trigger. */
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isNavOpen()) {
        closeNav();
        navToggle.focus();
      }
    });
  }

  /* ------------------------------------------------------------------
     Desktop Events dropdown — opens on hover or click of the trigger,
     closes on outside click, Escape, or link selection. Mirrors the
     open/close pattern already used for the mobile nav-pop panel.
     ------------------------------------------------------------------ */
  var navEventsDesktop = document.getElementById('navEventsDesktop');
  var navEventsToggle = document.getElementById('navEventsToggle');
  var navEventsPanel = document.getElementById('navEventsPanel');

  if (navEventsDesktop && navEventsToggle && navEventsPanel) {
    var eventsCloseTimer = null;

    function isEventsPanelOpen() {
      return navEventsDesktop.classList.contains('is-open');
    }

    function openEventsPanel() {
      if (eventsCloseTimer) {
        window.clearTimeout(eventsCloseTimer);
        eventsCloseTimer = null;
      }
      navEventsDesktop.classList.add('is-open');
      navEventsToggle.setAttribute('aria-expanded', 'true');
    }

    function closeEventsPanel() {
      navEventsDesktop.classList.remove('is-open');
      navEventsToggle.setAttribute('aria-expanded', 'false');
    }

    /* The panel is position:absolute, so it sits outside the wrapper's
       normal-flow hover box despite being visually attached right below
       the trigger. A short delay on mouseleave gives the cursor time to
       land inside the panel (which re-triggers mouseenter on the same
       wrapper, since the panel is a descendant of navEventsDesktop) before
       we actually close — without this, moving the cursor down through
       the visual gap between trigger and panel closes it prematurely. */
    navEventsDesktop.addEventListener('mouseenter', openEventsPanel);
    navEventsDesktop.addEventListener('mouseleave', function () {
      eventsCloseTimer = window.setTimeout(closeEventsPanel, 200);
    });

    /* Click/tap and keyboard support for non-hover input (touch
       laptops, keyboard navigation). The trigger is a real link to
       events.html, so only prevent default when we're toggling the
       panel open — a second activation (or Enter on an already-open
       trigger) lets the link navigate normally. */
    navEventsToggle.addEventListener('click', function (event) {
      if (!isEventsPanelOpen()) {
        event.preventDefault();
        openEventsPanel();
      }
    });

    document.addEventListener('click', function (event) {
      if (!isEventsPanelOpen()) return;
      if (navEventsDesktop.contains(event.target)) return;
      closeEventsPanel();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isEventsPanelOpen()) {
        closeEventsPanel();
        navEventsToggle.focus();
      }
    });
  }

  /* ------------------------------------------------------------------
     Mobile Events accordion — lives inside the existing mobile nav-pop
     panel. Tap to expand, tap again to collapse. No hover dependency.
     ------------------------------------------------------------------ */
  var navEventsAccordionToggle = document.getElementById('navEventsAccordionToggle');
  var navEventsAccordionPanel = document.getElementById('navEventsAccordionPanel');

  if (navEventsAccordionToggle && navEventsAccordionPanel) {
    navEventsAccordionToggle.addEventListener('click', function () {
      var isOpen = navEventsAccordionToggle.classList.contains('is-expanded');

      if (isOpen) {
        navEventsAccordionToggle.classList.remove('is-expanded');
        navEventsAccordionToggle.setAttribute('aria-expanded', 'false');
        navEventsAccordionPanel.style.maxHeight = null;
      } else {
        navEventsAccordionToggle.classList.add('is-expanded');
        navEventsAccordionToggle.setAttribute('aria-expanded', 'true');
        navEventsAccordionPanel.style.maxHeight = navEventsAccordionPanel.scrollHeight + 'px';
      }
    });

    /* Only the accordion links (not the disabled Coming Soon span)
       close the mobile nav-pop panel on selection; script.js's
       existing navMobile link-close logic already covers real <a>
       tags, including these, since they live inside #navMobile. */
  }

  /* ------------------------------------------------------------------
     Competition Day at a Glance — horizontal scroll strip. Touch and
     trackpad users already get native horizontal scroll/swipe for free
     via overflow-x:auto; this only adds two conveniences for desktop
     mouse users, who otherwise have no way to scroll a horizontal strip
     without a trackpad: click-and-drag, and plain (vertical) mouse-wheel
     input translated to horizontal movement.
     ------------------------------------------------------------------ */
  var dayGlanceSteps = document.getElementById('dayGlanceSteps');

  if (dayGlanceSteps) {
    var isDragging = false;
    var dragStartX = 0;
    var dragStartScroll = 0;
    var dragMoved = false;

    dayGlanceSteps.addEventListener('mousedown', function (event) {
      isDragging = true;
      dragMoved = false;
      dragStartX = event.pageX;
      dragStartScroll = dayGlanceSteps.scrollLeft;
      dayGlanceSteps.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', function (event) {
      if (!isDragging) return;
      var delta = event.pageX - dragStartX;
      if (Math.abs(delta) > 4) dragMoved = true;
      dayGlanceSteps.scrollLeft = dragStartScroll - delta;
    });

    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      dayGlanceSteps.classList.remove('is-dragging');
    }
    window.addEventListener('mouseup', endDrag);
    dayGlanceSteps.addEventListener('mouseleave', endDrag);

    /* A drag that actually moved the strip shouldn't also register as a
       click on whatever the cursor lands on when the mouse is released
       (the cards have no links today, but this keeps the behavior
       correct if that ever changes). */
    dayGlanceSteps.addEventListener('click', function (event) {
      if (dragMoved) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);

    /* Vertical wheel input scrolls the strip horizontally, matching the
       "mouse wheel + Shift" convenience many horizontal-scroll patterns
       offer — Shift+wheel already does this natively in every browser,
       so this only needs to handle the plain vertical-wheel case. */
    dayGlanceSteps.addEventListener('wheel', function (event) {
      if (event.deltaY === 0 || event.shiftKey) return;
      var atLeftEdge = dayGlanceSteps.scrollLeft <= 0 && event.deltaY < 0;
      var atRightEdge = dayGlanceSteps.scrollLeft + dayGlanceSteps.clientWidth >= dayGlanceSteps.scrollWidth - 1 && event.deltaY > 0;
      if (atLeftEdge || atRightEdge) return;
      event.preventDefault();
      dayGlanceSteps.scrollLeft += event.deltaY;
    }, { passive: false });

    /* Keyboard support for the focusable strip (tabindex="0" + role="group"
       in the markup) — Left/Right move by roughly one card width. */
    dayGlanceSteps.addEventListener('keydown', function (event) {
      var step = 160;
      if (event.key === 'ArrowRight') {
        dayGlanceSteps.scrollLeft += step;
        event.preventDefault();
      } else if (event.key === 'ArrowLeft') {
        dayGlanceSteps.scrollLeft -= step;
        event.preventDefault();
      }
    });
  }

  /* ------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------ */
  var yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
