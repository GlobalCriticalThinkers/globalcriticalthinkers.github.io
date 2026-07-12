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
    { key: 'competition', href: 'competition.html', i18n: 'nav.competition', label: 'Competition' },
    { key: 'contact', href: 'contact.html', i18n: 'nav.contact', label: 'Contact' }
  ];

  var REGISTER_HREF_FROM_HOME = '#registration';
  var REGISTER_HREF_FROM_ELSEWHERE = 'index.html#registration';

  function buildHeader(activePage) {
    var isHome = activePage === 'home';
    var registerHref = isHome ? REGISTER_HREF_FROM_HOME : REGISTER_HREF_FROM_ELSEWHERE;
    var logoHref = isHome ? '#arrival' : 'index.html';

    var desktopLinks = NAV_ITEMS.map(function (item) {
      var activeClass = item.key === activePage ? ' is-active' : '';
      return '<a href="' + item.href + '" class="site-nav__link' + activeClass + '" data-i18n="' + item.i18n + '">' + item.label + '</a>';
    }).join('\n        ');

    var mobileLinks = NAV_ITEMS.map(function (item) {
      var activeClass = item.key === activePage ? ' is-active' : '';
      return '<a href="' + item.href + '" class="nav-pop__link' + activeClass + '" role="menuitem" data-i18n="' + item.i18n + '">' + item.label + '</a>';
    }).join('\n            ');

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
            '<a href="' + registerHref + '" class="nav-pop__cta" role="menuitem" data-i18n="nav.register">Register now</a>' +
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
    buildHeader: buildHeader,
    buildFooter: buildFooter
  };
})();
