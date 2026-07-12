/**
 * Global Critical Thinkers — layout.js
 *
 * Single source of truth for every shared, cross-page UI component:
 *   - Header (logo, desktop nav, language switcher, mobile nav toggle + panel)
 *   - Footer (bookend, brand, Explore/Register/Contact columns, bottom bar)
 *
 * Nothing about header/footer markup should ever be written directly into
 * an HTML page again. To change the header or footer, edit this file once —
 * every page picks up the change automatically on next load.
 *
 * Each page only declares, via a `data-page` attribute on <body>, which nav
 * item is active and (optionally) whether it wants the full footer. See
 * layout-loader.js for how these are consumed.
 */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Primary navigation — single list, reused for desktop nav, mobile
     nav, and (indirectly) the footer's own internal links. Every page
     currently in the project links to all three destination pages plus
     Register; page-specific desktop nav subsets some projects had
     (e.g. contact.html only showing Home/About) were an artifact of
     hand-copied markup, not an intentional design decision, so this
     restores one consistent nav across all pages.
     ------------------------------------------------------------------ */
  var NAV_ITEMS = [
    { key: 'home', href: 'index.html', i18n: 'nav.home', label: 'Home' },
    { key: 'about', href: 'about.html', i18n: 'nav.about', label: 'About' },
    { key: 'contact', href: 'contact.html', i18n: 'nav.contact', label: 'Contact' }
  ];

  /* ------------------------------------------------------------------
     Events — the organization's permanent event directory. Rendered as
     a dropdown on desktop and an accordion on mobile. Unlike NAV_ITEMS,
     this is a parent with children, so it gets its own small structure
     rather than being forced into the flat nav list. New events (once
     they exist) get added to EVENTS_ITEMS only; nothing else changes.
     ------------------------------------------------------------------ */
  var EVENTS_ITEMS = [
    { key: 'genesis', href: 'competition.html', i18n: 'nav.eventsGenesis', label: 'Genesis', disabled: false },
    { key: 'coming-soon', href: null, i18n: 'nav.eventsComingSoon', label: 'Coming Soon', disabled: true }
  ];

  /* Renders as active whenever we're anywhere inside the Events
     section — currently the events directory and the Genesis detail
     page (competition.html, data-page="events"). */
  function buildHeader(activePage) {
    var isHome = activePage === 'home';
    var isEventsActive = activePage === 'events';
    var logoHref = isHome ? '#arrival' : 'index.html';

    var homeAboutLinks = NAV_ITEMS.slice(0, 2).map(function (item) {
      var activeClass = item.key === activePage ? ' is-active' : '';
      return '<a href="' + item.href + '" class="site-nav__link' + activeClass + '" data-i18n="' + item.i18n + '">' + item.label + '</a>';
    }).join('\n        ');

    var contactLink = NAV_ITEMS.slice(2).map(function (item) {
      var activeClass = item.key === activePage ? ' is-active' : '';
      return '<a href="' + item.href + '" class="site-nav__link' + activeClass + '" data-i18n="' + item.i18n + '">' + item.label + '</a>';
    }).join('');

    var desktopEventsChildren = EVENTS_ITEMS.map(function (item) {
      if (item.disabled) {
        return '<span class="nav-events__link is-disabled" role="menuitem" aria-disabled="true" data-i18n="' + item.i18n + '">' + item.label + '</span>';
      }
      return '<a href="' + item.href + '" class="nav-events__link" role="menuitem" data-i18n="' + item.i18n + '">' + item.label + '</a>';
    }).join('\n            ');

    var desktopLinks =
      homeAboutLinks +
      '\n        <div class="nav-events" id="navEventsDesktop">' +
        '<a href="events.html" class="site-nav__link nav-events__trigger' + (isEventsActive ? ' is-active' : '') + '" id="navEventsToggle" aria-haspopup="true" aria-expanded="false" aria-controls="navEventsPanel">' +
          '<span data-i18n="nav.events">Events</span>' +
          '<svg class="nav-events__chevron" width="9" height="6" viewBox="0 0 9 6" fill="none" aria-hidden="true"><path d="M1 1L4.5 4.5L8 1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</a>' +
        '<div class="nav-events__panel" id="navEventsPanel" role="menu" aria-label="Events">' +
        '\n            ' + desktopEventsChildren + '\n            ' +
        '</div>' +
      '</div>\n        ' +
      contactLink;

    var mobileEventsChildren = EVENTS_ITEMS.map(function (item) {
      if (item.disabled) {
        return '<span class="nav-pop__sublink is-disabled" role="menuitem" aria-disabled="true" data-i18n="' + item.i18n + '">' + item.label + '</span>';
      }
      return '<a href="' + item.href + '" class="nav-pop__sublink" role="menuitem" data-i18n="' + item.i18n + '">' + item.label + '</a>';
    }).join('\n              ') +
      '\n              <a href="events.html" class="nav-pop__sublink nav-pop__sublink--all" role="menuitem" data-i18n="nav.events">All Events</a>';

    var homeAboutMobile = NAV_ITEMS.slice(0, 2).map(function (item) {
      var activeClass = item.key === activePage ? ' is-active' : '';
      return '<a href="' + item.href + '" class="nav-pop__link' + activeClass + '" role="menuitem" data-i18n="' + item.i18n + '">' + item.label + '</a>';
    }).join('\n            ');

    var contactMobile = NAV_ITEMS.slice(2).map(function (item) {
      var activeClass = item.key === activePage ? ' is-active' : '';
      return '<a href="' + item.href + '" class="nav-pop__link' + activeClass + '" role="menuitem" data-i18n="' + item.i18n + '">' + item.label + '</a>';
    }).join('');

    var mobileLinks =
      homeAboutMobile +
      '\n            <div class="nav-pop__accordion">' +
        '<button type="button" class="nav-pop__link nav-pop__accordion-trigger' + (isEventsActive ? ' is-active' : '') + '" id="navEventsAccordionToggle" aria-expanded="false" aria-controls="navEventsAccordionPanel" data-i18n="nav.events">Events</button>' +
        '<div class="nav-pop__accordion-panel" id="navEventsAccordionPanel" role="menu" aria-label="Events">' +
        '\n              ' + mobileEventsChildren + '\n              ' +
        '</div>' +
      '</div>' +
      contactMobile;

    return (
      '<div class="site-header__inner">' +
        '<a href="' + logoHref + '" class="site-header__logo">' +
          '<img src="images/logo-horizontal.png" alt="Global Critical Thinkers" class="site-header__logo-img" data-i18n-alt="brand.logoAlt">' +
        '</a>' +

        '<nav class="site-nav" aria-label="Primary">' +
        '\n        ' + desktopLinks + '\n      ' +
        '</nav>' +

        '<div class="site-header__actions">' +
          '<div class="lang-switch" role="group" aria-label="Language switcher">' +
            '<button type="button" class="lang-switch__btn is-active" data-lang="en" aria-pressed="true">EN</button>' +
            '<span class="lang-switch__divider" aria-hidden="true">|</span>' +
            '<button type="button" class="lang-switch__btn" data-lang="id" aria-pressed="false">ID</button>' +
          '</div>' +
          '<div class="nav-pop">' +
            '<button type="button" class="site-nav__toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="navMobile">' +
              '<span class="site-nav__toggle-icon"></span>' +
            '</button>' +
            '<div class="nav-pop__panel" id="navMobile" role="menu">' +
            '\n            ' + mobileLinks + '\n            ' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  /* ------------------------------------------------------------------
     Footer — one shared implementation. The Explore column always
     points at index.html's real section IDs (quick-facts, how-it-works,
     why-gct, trust) regardless of which page it's rendered on, since
     those sections only exist on the homepage.
     ------------------------------------------------------------------ */
  function buildFooter(activePage) {
    var isHome = activePage === 'home';
    var prefix = isHome ? '' : 'index.html';

    return (
      '<p class="site-footer__bookend" data-i18n-html="footer.bookend">Think sharper.<br>Your turn.</p>' +

      '<div class="site-footer__main">' +
        '<div>' +
          '<div class="site-footer__brand">' +
            '<img src="images/logo-horizontal.png" alt="Global Critical Thinkers" class="site-footer__brand-img" data-i18n-alt="brand.logoAlt">' +
          '</div>' +
          '<p class="site-footer__tagline" data-i18n="footer.tagline">A Global Critical Thinking Competition where participants sharpen how they reason, judge, and communicate under real pressure.</p>' +
        '</div>' +

        '<nav class="footer-col" aria-label="Site navigation">' +
          '<p class="footer-col__title" data-i18n="footer.exploreTitle">Explore</p>' +
          '<ul>' +
            '<li><a href="' + prefix + '#why-gct" data-i18n="footer.exploreWhyGct">Why GCT</a></li>' +
            '<li><a href="' + prefix + '#how-it-works" data-i18n="footer.exploreHowItWorks">How it works</a></li>' +
            '<li><a href="' + prefix + '#quick-facts" data-i18n="footer.exploreOverview">Overview</a></li>' +
            '<li><a href="' + prefix + '#trust" data-i18n="footer.exploreFaq">Everything to Know</a></li>' +
          '</ul>' +
        '</nav>' +

        '<nav class="footer-col" aria-label="Registration">' +
          '<p class="footer-col__title" data-i18n="footer.registerTitle">Register</p>' +
          '<ul>' +
            '<li><a href="' + prefix + '#registration" data-i18n="footer.registerPricing">Pricing</a></li>' +
            '<li><a href="[[REGISTRATION_LINK_PLACEHOLDER]]" data-i18n="footer.registerNow">Register now</a></li>' +
          '</ul>' +
        '</nav>' +

        '<nav class="footer-col" aria-label="Contact">' +
          '<p class="footer-col__title" data-i18n="footer.contactTitle">Contact</p>' +
          '<ul>' +
            '<li><a href="contact.html" data-i18n="footer.contactEmail">Email us</a></li>' +
            '<li><a href="[[INSTAGRAM_LINK_PLACEHOLDER]]" data-i18n="footer.contactInstagram">Instagram</a></li>' +
          '</ul>' +
        '</nav>' +
      '</div>' +

      '<div class="site-footer__bottom">' +
        '<p><span data-i18n="footer.copyright">©</span> <span id="currentYear"></span> Global Critical Thinkers.</p>' +
        '<p data-i18n="footer.bottomTagline">Think sharper. Reason without a script.</p>' +
      '</div>'
    );
  }

  window.GCTLayout = {
    NAV_ITEMS: NAV_ITEMS,
    EVENTS_ITEMS: EVENTS_ITEMS,
    buildHeader: buildHeader,
    buildFooter: buildFooter
  };
})();
