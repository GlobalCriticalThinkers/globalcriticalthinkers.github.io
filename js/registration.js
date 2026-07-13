/**
 * Global Critical Thinkers — registration.js
 *
 * Shared framework for the five-step Genesis registration workflow
 * (register-genesis-stepN.html). Everything here is written to be
 * reused by every step, not just Step 1:
 *
 *   - initSearchableCombo()  — powers Country of Residence and both
 *     WhatsApp country-code fields; any future step reuses the same
 *     function by giving a [data-combo] wrapper the right data source.
 *   - setupDateOfBirth()     — computes the 11–25 year eligible range
 *     from today's date at runtime; no hardcoded years anywhere.
 *   - Validation             — novalidate on the <form>, manual checks
 *     per field, .is-invalid class toggling, matching the site's
 *     existing visual language instead of native browser popups.
 *
 * Depends on registration-data.js (window.GCTRegistrationData) having
 * already loaded.
 */

(function () {
  'use strict';

  var data = window.GCTRegistrationData || { COUNTRIES: [], DIAL_CODES: [] };

  /* ------------------------------------------------------------------
     Searchable combo (Country of Residence, WhatsApp country codes)
     ------------------------------------------------------------------
     Expects markup:
       <div class="reg-combo" data-combo="country|dialcode">
         <button class="reg-combo__trigger">
           <span class="reg-combo__value">…</span>
         </button>
         <div class="reg-combo__panel">
           <input class="reg-combo__search">
           <ul class="reg-combo__list"></ul>
         </div>
         <input type="hidden" name="…">
       </div>
     ------------------------------------------------------------------ */
  function buildOptions(kind) {
    if (kind === 'country') {
      return data.COUNTRIES.map(function (name) {
        return { label: name, value: name, searchText: name.toLowerCase() };
      });
    }
    if (kind === 'dialcode') {
      return data.DIAL_CODES.map(function (entry) {
        return {
          label: entry.code + ' — ' + entry.country,
          value: entry.code,
          searchText: (entry.code + ' ' + entry.country).toLowerCase()
        };
      });
    }
    return [];
  }

  function initSearchableCombo(wrapper) {
    var kind = wrapper.getAttribute('data-combo');
    var options = buildOptions(kind);

    var trigger = wrapper.querySelector('.reg-combo__trigger');
    var valueEl = wrapper.querySelector('.reg-combo__value');
    var panel = wrapper.querySelector('.reg-combo__panel');
    var searchInput = wrapper.querySelector('.reg-combo__search');
    var list = wrapper.querySelector('.reg-combo__list');
    var hiddenInput = wrapper.querySelector('input[type="hidden"]');

    if (!trigger || !panel || !list || !hiddenInput) return;

    var highlightedIndex = -1;
    var visibleOptions = options.slice();

    function renderList() {
      list.innerHTML = '';
      if (visibleOptions.length === 0) {
        var empty = document.createElement('li');
        empty.className = 'reg-combo__empty';
        empty.textContent = 'No matches found';
        list.appendChild(empty);
        return;
      }
      visibleOptions.forEach(function (opt, index) {
        var item = document.createElement('li');
        item.className = 'reg-combo__option';
        item.setAttribute('role', 'option');
        item.setAttribute('data-value', opt.value);
        item.textContent = opt.label;
        if (index === highlightedIndex) item.classList.add('is-highlighted');
        item.addEventListener('mousedown', function (event) {
          // mousedown (not click) so it fires before the search input's blur
          event.preventDefault();
          selectOption(opt);
        });
        list.appendChild(item);
      });
    }

    function selectOption(opt) {
      hiddenInput.value = opt.value;
      valueEl.textContent = kind === 'dialcode' ? opt.value : opt.label;
      trigger.classList.remove('is-placeholder');
      var fieldWrap = wrapper.closest('.contact-form__field');
      if (fieldWrap) fieldWrap.classList.remove('is-invalid');
      closePanel();
      hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function openPanel() {
      wrapper.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      searchInput.value = '';
      visibleOptions = options.slice();
      highlightedIndex = -1;
      renderList();
      window.setTimeout(function () { searchInput.focus(); }, 10);
      document.addEventListener('mousedown', onOutsideClick);
      document.addEventListener('keydown', onKeydown);
    }

    function closePanel() {
      wrapper.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      document.removeEventListener('mousedown', onOutsideClick);
      document.removeEventListener('keydown', onKeydown);
    }

    function isOpen() { return wrapper.classList.contains('is-open'); }

    function onOutsideClick(event) {
      if (!wrapper.contains(event.target)) closePanel();
    }

    function onKeydown(event) {
      if (!isOpen()) return;
      if (event.key === 'Escape') {
        closePanel();
        trigger.focus();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        highlightedIndex = Math.min(highlightedIndex + 1, visibleOptions.length - 1);
        renderList();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        highlightedIndex = Math.max(highlightedIndex - 1, 0);
        renderList();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (highlightedIndex >= 0 && visibleOptions[highlightedIndex]) {
          selectOption(visibleOptions[highlightedIndex]);
        }
      }
    }

    trigger.addEventListener('click', function () {
      if (isOpen()) { closePanel(); } else { openPanel(); }
    });

    searchInput.addEventListener('input', function () {
      var query = searchInput.value.trim().toLowerCase();
      visibleOptions = query
        ? options.filter(function (opt) { return opt.searchText.indexOf(query) !== -1; })
        : options.slice();
      highlightedIndex = -1;
      renderList();
    });
  }

  function initAllCombos() {
    document.querySelectorAll('[data-combo]').forEach(initSearchableCombo);
  }

  /* ------------------------------------------------------------------
     Date of birth — dynamic 11–25 year eligible range, no hardcoded
     years. Recomputed from "today" every time the page loads.
     ------------------------------------------------------------------ */
  function setupDateOfBirth() {
    var input = document.getElementById('rg-dob');
    if (!input) return;

    var today = new Date();
    var maxDate = new Date(today.getFullYear() - 11, today.getMonth(), today.getDate());
    var minDate = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());

    function toISO(d) {
      var y = d.getFullYear();
      var m = String(d.getMonth() + 1).padStart(2, '0');
      var day = String(d.getDate()).padStart(2, '0');
      return y + '-' + m + '-' + day;
    }

    input.min = toISO(minDate);
    input.max = toISO(maxDate);

    // The field is NOT readonly (readonly suppresses the native picker
    // on click/tap in most browsers, which is exactly the bug this
    // fixes). Instead: showPicker() opens the calendar on click/focus,
    // and a keydown listener blocks character entry so the only way to
    // set a value is through the picker itself. Navigation, accessibility,
    // and clipboard keys are explicitly allowed through.
    function open() {
      if (typeof input.showPicker === 'function') {
        try { input.showPicker(); } catch (e) { /* ignore unsupported state */ }
      }
    }
    input.addEventListener('click', open);
    input.addEventListener('focus', open);

    var allowedKeys = [
      'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Backspace', 'Delete', 'Home', 'End'
    ];
    input.addEventListener('keydown', function (event) {
      var isAllowedNav = allowedKeys.indexOf(event.key) !== -1;
      var isCopyPaste = (event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].indexOf(event.key.toLowerCase()) !== -1;
      if (isAllowedNav || isCopyPaste) return;
      event.preventDefault();
    });
  }

  /* ------------------------------------------------------------------
     Validation — replaces native browser popups entirely. Runs on
     submit; toggles .is-invalid on each field wrapper and shows the
     matching .reg-field__error text already in the markup.
     ------------------------------------------------------------------ */
  function isDateWithinRange(input) {
    if (!input.value) return false;
    return input.value >= input.min && input.value <= input.max;
  }

  function fieldWrapperOf(el) {
    return el.closest('.contact-form__field');
  }

  function markInvalid(el) {
    var wrap = fieldWrapperOf(el);
    if (wrap) wrap.classList.add('is-invalid');
  }

  function markValid(el) {
    var wrap = fieldWrapperOf(el);
    if (wrap) wrap.classList.remove('is-invalid');
  }

  function validateStep1(form) {
    var valid = true;
    var firstInvalid = null;

    function fail(el) {
      markInvalid(el);
      valid = false;
      if (!firstInvalid) firstInvalid = fieldWrapperOf(el) || el;
    }

    // Required text/select inputs
    form.querySelectorAll('[required]').forEach(function (el) {
      if (el.type === 'radio') return; // handled as a group below
      if (el.type === 'hidden') {
        if (!el.value) { fail(el); } else { markValid(el); }
        return;
      }
      if (!el.value || !el.value.trim()) {
        fail(el);
      } else {
        markValid(el);
      }
    });

    // Date of birth range check (in addition to required-empty check above)
    var dob = document.getElementById('rg-dob');
    if (dob && dob.value && !isDateWithinRange(dob)) {
      fail(dob);
    }

    // Gender radio group
    var genderChecked = form.querySelector('input[name="gender"]:checked');
    var genderGroup = form.querySelector('input[name="gender"]');
    if (!genderChecked && genderGroup) {
      var wrap = genderGroup.closest('.contact-form__field');
      if (wrap) wrap.classList.add('is-invalid');
      valid = false;
      if (!firstInvalid) firstInvalid = wrap;
    } else if (genderGroup) {
      var okWrap = genderGroup.closest('.contact-form__field');
      if (okWrap) okWrap.classList.remove('is-invalid');
    }

    return { valid: valid, firstInvalid: firstInvalid };
  }

  function initStep1Form() {
    var form = document.getElementById('regStep1Form');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var result = validateStep1(form);
      if (!result.valid) {
        if (result.firstInvalid && result.firstInvalid.scrollIntoView) {
          result.firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      // Step 2 does not exist yet — this is the prepared hand-off point.
      window.location.href = 'register-genesis-step2.html';
    });

    // Clear the invalid state as soon as the person fixes a field.
    form.querySelectorAll('.contact-form__input, .contact-form__textarea, select').forEach(function (el) {
      el.addEventListener('input', function () { markValid(el); });
      el.addEventListener('change', function () { markValid(el); });
    });
    form.querySelectorAll('input[name="gender"]').forEach(function (el) {
      el.addEventListener('change', function () {
        var wrap = el.closest('.contact-form__field');
        if (wrap) wrap.classList.remove('is-invalid');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initAllCombos();
    setupDateOfBirth();
    initStep1Form();
  });
})();
