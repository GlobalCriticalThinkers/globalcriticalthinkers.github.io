/**
 * Global Critical Thinkers — email-validation.js
 *
 * Reusable email address validation, built to match phone-validation.js
 * in structure and behavior so the two feel like one consistent system:
 *
 *   - Validates while typing (silent until the field has been touched,
 *     same "don't flash red on every keystroke" rule as phone).
 *   - Validates again on blur and on submit.
 *   - Never relies solely on the browser's native type="email" popup —
 *     the native constraint is checked, but display and gating happen
 *     entirely through this module's own regex + status element.
 *
 * Attaches to any input.reg-email-input. Exposes
 * input.emailValidator = { isValid(), forceCheck() } so a step's submit
 * handler can require validity before continuing, the same way
 * .reg-tel wrappers expose wrapper.phoneValidator.
 *
 * Usage: GCTEmailValidation.attachAll() once per page (called from
 * registration.js's DOMContentLoaded handler, right alongside
 * GCTPhoneValidation.attachAll()).
 */

(function () {
  'use strict';

  // Practical email-format check: local part, @, domain with at least
  // one dot and a 2+ letter TLD. Deliberately not full RFC 5322 (which
  // is far looser than most real inboxes accept) — this is the same
  // "good enough, not naive" bar the site already applies to phone
  // numbers via libphonenumber-js.
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function fieldWrapperOf(el) {
    return el.closest('.contact-form__field');
  }

  function ensureStatusEl(input) {
    var existing = input.parentElement.querySelector('.reg-field__email-status');
    if (existing) return existing;
    // Markup already includes <p class="reg-field__email-status">; this
    // fallback only fires if a future step reuses the module without it.
    var status = document.createElement('p');
    status.className = 'reg-field__email-status';
    status.setAttribute('aria-live', 'polite');
    input.insertAdjacentElement('afterend', status);
    return status;
  }

  function attach(input) {
    if (!input) return null;

    var status = ensureStatusEl(input);
    var fieldWrap = fieldWrapperOf(input);
    var state = { valid: false, touched: false };

    function clearMessage() {
      status.classList.remove('is-visible', 'is-valid', 'is-invalid');
      input.classList.remove('reg-email-input--valid', 'reg-email-input--invalid');
    }

    function showValid() {
      status.textContent = '✓ Valid email address.';
      status.setAttribute('data-i18n', 'regValidation.emailValid');
      status.classList.remove('is-invalid');
      status.classList.add('is-visible', 'is-valid');
      input.classList.add('reg-email-input--valid');
      input.classList.remove('reg-email-input--invalid');
    }

    function showInvalid() {
      status.textContent = '❌ Invalid email address.';
      status.setAttribute('data-i18n', 'regValidation.emailInvalid');
      status.classList.remove('is-valid');
      status.classList.add('is-visible', 'is-invalid');
      input.classList.add('reg-email-input--invalid');
      input.classList.remove('reg-email-input--valid');
    }

    function isFormatValid(value) {
      // Native constraint first (catches things like literal spaces
      // that some browsers reject even before our regex runs), then
      // our own pattern — so the browser's built-in check is only one
      // input, never the sole gate.
      return input.checkValidity() && EMAIL_PATTERN.test(value);
    }

    function runValidation(opts) {
      var options = opts || {};
      var raw = input.value.trim();

      if (!raw) {
        state.valid = false;
        clearMessage();
        if (fieldWrap) fieldWrap.classList.remove('is-invalid');
        return;
      }

      var valid = isFormatValid(raw);
      state.valid = valid;

      if (valid) {
        showValid();
        if (fieldWrap) fieldWrap.classList.remove('is-invalid');
      } else if (options.silent) {
        // Still typing — don't show red until the field has been
        // touched/blurred, matching the phone field's behavior.
        clearMessage();
      } else {
        showInvalid();
        if (options.markInvalidField && fieldWrap) fieldWrap.classList.add('is-invalid');
      }
    }

    input.addEventListener('input', function () {
      runValidation({ silent: !state.touched });
    });

    input.addEventListener('blur', function () {
      state.touched = true;
      runValidation({ markInvalidField: true });
    });

    input.addEventListener('focus', function () {
      state.touched = true;
    });

    var validator = {
      isValid: function () {
        // Empty is handled by the existing required-field check in
        // registration.js, same division of responsibility as phone.
        return !input.value.trim() || state.valid;
      },
      forceCheck: function () {
        state.touched = true;
        runValidation({ markInvalidField: true });
        return state.valid;
      }
    };

    input.emailValidator = validator;
    return validator;
  }

  function attachAll(root) {
    var scope = root || document;
    var validators = [];
    scope.querySelectorAll('.reg-email-input').forEach(function (input) {
      var v = attach(input);
      if (v) validators.push(v);
    });
    return validators;
  }

  window.GCTEmailValidation = {
    attach: attach,
    attachAll: attachAll
  };
})();
