/**
 * Global Critical Thinkers — layout-loader.js
 *
 * Injects the shared header and footer (defined once in layout.js) into
 * every page. Must load and run BEFORE i18n.js and script.js, since both
 * query for elements that only exist once this injection has happened
 * (navToggle, .lang-switch__btn, [data-i18n] nodes inside header/footer).
 *
 * Page-specific configuration lives entirely on <body>:
 *   data-page="home|about|competition|contact"   → which nav item is active
 *   data-footer="full|none"                       → whether to render the
 *                                                    footer (default: full)
 *
 * A page needs nothing else to get the current header/footer/nav:
 *   <body data-page="about">
 *     <div data-layout="header"></div>
 *     ...page content...
 *     <div data-layout="footer"></div>
 *   </body>
 */

(function () {
  'use strict';

  var body = document.body;
  var activePage = body.getAttribute('data-page') || '';
  var footerMode = body.getAttribute('data-footer') || 'full';

  var headerSlot = document.querySelector('[data-layout="header"]');
  var footerSlot = document.querySelector('[data-layout="footer"]');

  if (headerSlot && window.GCTLayout) {
    headerSlot.innerHTML = window.GCTLayout.buildHeader(activePage);
  }

  if (footerSlot && footerMode !== 'none' && window.GCTLayout) {
    footerSlot.innerHTML = window.GCTLayout.buildFooter(activePage);
  }
})();
