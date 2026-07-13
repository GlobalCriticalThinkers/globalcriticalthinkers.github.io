/**
 * Global Critical Thinkers — i18n.js
 *
 * Small, dependency-free language engine.
 * - Reads translations from translations.js (global `translations`, `languages`)
 * - Applies text via data-i18n / data-i18n-html / data-i18n-alt /
 *   data-i18n-aria-label / data-i18n-content attributes
 * - Persists the chosen language in localStorage
 * - Updates <html lang="">
 * - Fades content briefly during the swap (150–250ms)
 *
 * Adding a language: add its block to translations.js and its
 * { code, label } entry to the `languages` array. This file and the HTML
 * do not need to change.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'gct-lang';
  const DEFAULT_LANG = 'en';
  const FADE_MS = 200;

  function getStoredLang() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeLang(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* localStorage unavailable (e.g. private mode) — fail silently */
    }
  }

  function resolveInitialLang() {
    const stored = getStoredLang();
    if (stored && translations[stored]) return stored;
    return DEFAULT_LANG;
  }

  function getValue(langObj, path) {
    const parts = path.split('.');
    let node = langObj;
    for (let i = 0; i < parts.length; i++) {
      if (node == null) return undefined;
      node = node[parts[i]];
    }
    return node;
  }

  function applyTranslations(lang) {
    const dict = translations[lang] || translations[DEFAULT_LANG];

    // Plain text content
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      const value = getValue(dict, key);
      if (typeof value === 'string') {
        el.textContent = value;
      }
    });

    // HTML content (headlines with <br>, <em>, etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-html');
      const value = getValue(dict, key);
      if (typeof value === 'string') {
        el.innerHTML = value;
      }
    });

    // alt attributes
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-alt');
      const value = getValue(dict, key);
      if (typeof value === 'string') {
        el.setAttribute('alt', value);
      }
    });

    // aria-label attributes
    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-aria-label');
      const value = getValue(dict, key);
      if (typeof value === 'string') {
        el.setAttribute('aria-label', value);
      }
    });

    // placeholder attributes (inputs, textareas)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-placeholder');
      const value = getValue(dict, key);
      if (typeof value === 'string') {
        el.setAttribute('placeholder', value);
      }
    });

    // content attributes (meta tags) + <title>
    document.querySelectorAll('[data-i18n-content]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-content');
      const value = getValue(dict, key);
      if (typeof value !== 'string') return;
      if (el.tagName === 'TITLE') {
        el.textContent = value;
      } else {
        el.setAttribute('content', value);
      }
    });

    // <title> also carries a plain data-i18n in our markup
    const titleEl = document.querySelector('title[data-i18n]');
    if (titleEl) {
      const value = getValue(dict, titleEl.getAttribute('data-i18n'));
      if (typeof value === 'string') document.title = value;
    }

    document.documentElement.setAttribute('lang', lang);
  }

  function updateSwitchUI(lang) {
    document.querySelectorAll('.lang-switch__btn').forEach(function (btn) {
      const isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function setLanguage(lang, opts) {
    const options = opts || {};
    if (!translations[lang]) lang = DEFAULT_LANG;

    if (options.animate === false) {
      applyTranslations(lang);
      updateSwitchUI(lang);
      storeLang(lang);
      return;
    }

    const root = document.body;
    root.style.transition = 'opacity ' + FADE_MS + 'ms ease';
    root.style.opacity = '0';

    window.setTimeout(function () {
      applyTranslations(lang);
      updateSwitchUI(lang);
      storeLang(lang);
      root.style.opacity = '1';
    }, FADE_MS);
  }

  function initLangSwitch() {
    document.querySelectorAll('.lang-switch__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const lang = btn.getAttribute('data-lang');
        if (!lang) return;
        setLanguage(lang);
      });
    });
  }

  // Public API (used only if other scripts need it; not required otherwise)
  window.GCTi18n = {
    setLanguage: setLanguage,
    getCurrentLang: function () {
      return document.documentElement.getAttribute('lang') || DEFAULT_LANG;
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    const initialLang = resolveInitialLang();
    applyTranslations(initialLang);
    updateSwitchUI(initialLang);
    initLangSwitch();
  });
})();
