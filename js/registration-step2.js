/**
 * Global Critical Thinkers — registration-step2.js
 *
 * Step 2 — Research Topic Selection.
 *
 * The participant never picks an age group directly. Age is derived
 * from the Date of Birth saved by Step 1 (registration-state.js), and
 * that age determines which two-item topic list from
 * registration-data.js's RESEARCH_TOPICS is shown. If Step 1's data is
 * missing (direct page load, cleared session), the participant is sent
 * back to Step 1 rather than shown an empty or wrong-guess dropdown.
 *
 * Depends on:
 *   - registration-data.js  (window.GCTRegistrationData.RESEARCH_TOPICS)
 *   - registration-state.js (window.GCTRegistrationState)
 */

(function () {
  'use strict';

  var data = window.GCTRegistrationData || {};
  var topicBands = data.RESEARCH_TOPICS || {};

  /* ------------------------------------------------------------------
     Age calculation — same "years elapsed, adjusted if birthday hasn't
     happened yet this year" logic used everywhere ages are computed
     from a DOB, run against today's real date at page-load time.
     ------------------------------------------------------------------ */
  function calculateAge(dobString) {
    if (!dobString) return null;
    var dob = new Date(dobString + 'T00:00:00');
    if (isNaN(dob.getTime())) return null;

    var today = new Date();
    var age = today.getFullYear() - dob.getFullYear();
    var hasHadBirthdayThisYear =
      today.getMonth() > dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
    if (!hasHadBirthdayThisYear) age -= 1;

    return age;
  }

  function bandForAge(age) {
    var keys = Object.keys(topicBands);
    for (var i = 0; i < keys.length; i++) {
      var band = topicBands[keys[i]];
      if (age >= band.minAge && age <= band.maxAge) return band;
    }
    return null;
  }

  /* ------------------------------------------------------------------
     Init
     ------------------------------------------------------------------ */
  function initStep2() {
    var form = document.getElementById('regStep2Form');
    if (!form) return;

    var select = document.getElementById('rg-topic');
    var preview = document.getElementById('rg-topic-preview');
    var previewTitle = document.getElementById('rg-topic-preview-title');
    var previewCopy = document.getElementById('rg-topic-preview-copy');
    var ageNotice = document.getElementById('rg-topic-age-notice');
    if (!select) return;

    var state = window.GCTRegistrationState;
    var dob = state ? state.get('dateOfBirth') : null;
    var age = calculateAge(dob);
    var band = age !== null ? bandForAge(age) : null;

    // No usable DOB (Step 1 skipped, session cleared, direct link) —
    // the whole page depends on it, so send the participant back
    // rather than render a broken/empty topic list.
    if (age === null || !band) {
      window.location.href = 'register-genesis-step1.html';
      return;
    }

    var previouslySelected = state ? state.get('researchTopic') : null;

    function renderOptions() {
      select.innerHTML = '';

      var placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.disabled = true;
      placeholder.textContent = 'Select your topic';
      placeholder.setAttribute('data-i18n', 'regStep2.topicPlaceholder');
      select.appendChild(placeholder);

      band.topics.forEach(function (topic) {
        var option = document.createElement('option');
        option.value = topic.value;
        option.textContent = topic.label;
        select.appendChild(option);
      });

      // Restore a prior selection only if it's still valid for the
      // (re)computed age band; otherwise fall back to the placeholder,
      // per the "clear selection automatically" requirement.
      var stillValid = previouslySelected && band.topics.some(function (t) {
        return t.value === previouslySelected;
      });
      select.value = stillValid ? previouslySelected : '';
      placeholder.selected = !stillValid;

      updatePreview();
    }

    function updatePreview() {
      var topic = band.topics.filter(function (t) { return t.value === select.value; })[0];

      if (!topic) {
        if (preview) preview.hidden = true;
        return;
      }

      if (previewTitle) previewTitle.textContent = topic.label;
      if (previewCopy) previewCopy.textContent = topic.description;
      if (preview) preview.hidden = false;
    }

    if (ageNotice) {
      ageNotice.textContent = 'Based on your date of birth, you are eligible for topics in the ' +
        band.minAge + '\u2013' + band.maxAge + ' age category.';
    }

    renderOptions();

    select.addEventListener('change', function () {
      var fieldWrap = select.closest('.contact-form__field');
      if (fieldWrap) fieldWrap.classList.remove('is-invalid');
      updatePreview();
    });

    // ------------------------------------------------------------------
    // Validation + navigation — mirrors registration.js's Step 1 pattern
    // (novalidate on the form, manual required check, .is-invalid
    // toggling, scroll to first invalid field).
    // ------------------------------------------------------------------
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var fieldWrap = select.closest('.contact-form__field');
      if (!select.value) {
        if (fieldWrap) fieldWrap.classList.add('is-invalid');
        fieldWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (fieldWrap) fieldWrap.classList.remove('is-invalid');

      if (state) {
        state.set('researchTopic', select.value);
      }

      // Step 3 does not exist yet — this is the prepared hand-off point.
      window.location.href = 'register-genesis-step3.html';
    });
  }

  document.addEventListener('DOMContentLoaded', initStep2);
})();
