/**
 * Global Critical Thinkers — phone-validation.js
 *
 * Reusable WhatsApp / phone number validation built on libphonenumber-js
 * (loaded from CDN in the page <head>, no build step, no npm).
 *
 * Attaches to any .reg-tel wrapper that has:
 *   - a .reg-combo[data-combo="dialcode"] with a hidden input holding the
 *     currently selected dial code (e.g. "+62")
 *   - a phone <input> (type="tel")
 * and (optionally) a following .reg-field__phone-status element for the
 * inline valid/invalid message — created automatically if missing.
 *
 * Usage: call GCTPhoneValidation.attach(wrapperEl) once per .reg-tel
 * block. Exposes wrapper.phoneValidator = { isValid(), forceCheck() }
 * so the step's submit handler can require validity before continuing.
 *
 * Depends on window.libphonenumber (UMD build from the CDN script tag).
 * Falls back to leaving fields un-validated (but still functional) if
 * the library failed to load, so a slow/broken CDN request never blocks
 * registration entirely.
 */

(function () {
  'use strict';

  function getLib() {
    return window.libphonenumber || null;
  }

  function fieldWrapperOf(el) {
    return el.closest('.contact-form__field');
  }

  function ensureStatusEl(wrapper) {
    var existing = wrapper.parentElement.querySelector('.reg-field__phone-status');
    if (existing) return existing;
    var status = document.createElement('p');
    status.className = 'reg-field__phone-status';
    status.setAttribute('aria-live', 'polite');
    // Insert right after the .reg-tel wrapper, before any existing
    // .reg-field__error so the required-field error still renders below.
    wrapper.insertAdjacentElement('afterend', status);
    return status;
  }

  function attach(wrapper) {
    var lib = getLib();
    var codeCombo = wrapper.querySelector('.reg-combo[data-combo="dialcode"]');
    var codeInput = codeCombo ? codeCombo.querySelector('input[type="hidden"]') : null;
    var phoneInput = wrapper.querySelector('input[type="tel"]');
    if (!codeInput || !phoneInput) return null;

    var status = ensureStatusEl(wrapper);
    var fieldWrap = fieldWrapperOf(wrapper);

    var state = { valid: false, touched: false };

    function dialCodeToRegion(dialCode) {
      if (!lib || !dialCode) return undefined;
      try {
        var countries = lib.getCountries();
        for (var i = 0; i < countries.length; i++) {
          if (lib.getCountryCallingCode(countries[i]) === dialCode.replace('+', '')) {
            return countries[i];
          }
        }
      } catch (e) { /* ignore */ }
      return undefined;
    }

    function clearMessage() {
      status.classList.remove('is-visible', 'is-valid', 'is-invalid');
      wrapper.classList.remove('reg-tel--valid', 'reg-tel--invalid');
      window.setTimeout(function () {
        if (!status.classList.contains('is-visible')) status.textContent = '';
      }, 200);
    }

    function showValid() {
      status.textContent = '✓ Valid phone number.';
      status.setAttribute('data-i18n', 'regValidation.phoneValid');
      status.classList.remove('is-invalid');
      status.classList.add('is-visible', 'is-valid');
      wrapper.classList.add('reg-tel--valid');
      wrapper.classList.remove('reg-tel--invalid');
    }

    function showInvalid() {
      status.textContent = '❌ Invalid phone number.';
      status.setAttribute('data-i18n', 'regValidation.phoneInvalid');
      status.classList.remove('is-valid');
      status.classList.add('is-visible', 'is-invalid');
      wrapper.classList.add('reg-tel--invalid');
      wrapper.classList.remove('reg-tel--valid');
    }

    function runValidation(opts) {
      var options = opts || {};
      var raw = phoneInput.value.trim();
      var dialCode = codeInput.value || '+62';

      if (!raw) {
        state.valid = false;
        clearMessage();
        if (fieldWrap) fieldWrap.classList.remove('is-invalid');
        return;
      }

      if (!lib) {
        // Library unavailable — don't block the user, just skip styling.
        state.valid = true;
        clearMessage();
        return;
      }

      var region = dialCodeToRegion(dialCode);
      var fullNumber = dialCode + raw.replace(/[^\d]/g, '');

      var parsed = null;
      try {
        parsed = lib.parsePhoneNumberFromString(fullNumber, region);
      } catch (e) {
        parsed = null;
      }

      var isValid = !!(parsed && parsed.isValid());
      state.valid = isValid;

      if (isValid) {
        showValid();
        if (fieldWrap) fieldWrap.classList.remove('is-invalid');
      } else if (options.silent) {
        // Typing hasn't produced a valid number yet — don't show the
        // error state until the field has been touched/blurred, so the
        // message doesn't flash red on every keystroke.
        clearMessage();
      } else {
        showInvalid();
        if (options.markInvalidField && fieldWrap) fieldWrap.classList.add('is-invalid');
      }
    }

    function formatAsTyped() {
      if (!lib) return;
      var dialCode = codeInput.value || '+62';
      var region = dialCodeToRegion(dialCode);
      if (!region) return;

      var caretAtEnd = phoneInput.selectionStart === phoneInput.value.length;
      try {
        var asYouType = new lib.AsYouType(region);
        var formatted = asYouType.input(phoneInput.value);
        if (formatted && formatted !== phoneInput.value) {
          phoneInput.value = formatted;
          if (caretAtEnd) {
            phoneInput.setSelectionRange(formatted.length, formatted.length);
          }
        }
      } catch (e) { /* ignore formatting errors, keep raw input */ }
    }

    phoneInput.addEventListener('input', function () {
      formatAsTyped();
      runValidation({ silent: !state.touched });
    });

    phoneInput.addEventListener('blur', function () {
      state.touched = true;
      runValidation({ markInvalidField: true });
    });

    phoneInput.addEventListener('focus', function () {
      // Re-touch so corrections while focused show live feedback again.
      state.touched = true;
    });

    // Re-validate whenever the dial code combo's hidden input changes
    // (registration.js dispatches a 'change' event on selection).
    codeInput.addEventListener('change', function () {
      formatAsTyped();
      runValidation({ markInvalidField: state.touched });
    });

    var validator = {
      isValid: function () {
        // Empty is only "valid" in the sense of not being a format
        // error; required-field emptiness is handled by the existing
        // required-field check in registration.js.
        return !phoneInput.value.trim() || state.valid;
      },
      forceCheck: function () {
        state.touched = true;
        runValidation({ markInvalidField: true });
        return state.valid;
      }
    };

    wrapper.phoneValidator = validator;
    return validator;
  }

  function attachAll(root) {
    var scope = root || document;
    var validators = [];
    scope.querySelectorAll('.reg-tel').forEach(function (wrapper) {
      var v = attach(wrapper);
      if (v) validators.push(v);
    });
    return validators;
  }

  window.GCTPhoneValidation = {
    attach: attach,
    attachAll: attachAll
  };
})();
