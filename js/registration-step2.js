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
 * All visible text (topic labels, descriptions, the age-eligibility
 * notice, the placeholder option) is generated at runtime rather than
 * sitting as static markup, since it depends on the participant's
 * computed age band. Because i18n.js's applyTranslations() only walks
 * elements already in the DOM, none of this would be caught by a normal
 * data-i18n pass — so this file looks strings up itself via
 * window.GCTi18n.t() (falling back to English if i18n.js hasn't loaded
 * for some reason) and re-renders on the 'gct:langchange' event i18n.js
 * dispatches after a language switch.
 *
 * Depends on:
 *   - registration-data.js  (window.GCTRegistrationData.RESEARCH_TOPICS)
 *   - registration-state.js (window.GCTRegistrationState)
 *   - i18n.js               (window.GCTi18n.t(), 'gct:langchange' event)
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
     Translation lookup with English fallback. Wraps window.GCTi18n.t()
     so a missing i18n.js (shouldn't happen, but this page shouldn't
     hard-fail if it does) still renders readable English rather than
     throwing or showing blank text.
     ------------------------------------------------------------------ */
  function t(path, vars, fallback) {
    if (window.GCTi18n && typeof window.GCTi18n.t === 'function') {
      var value = window.GCTi18n.t(path, vars);
      if (typeof value === 'string') return value;
    }
    return fallback;
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

    function topicLabel(topic) {
      return t('regStep2.topics.' + topic.i18nKey + '.label', null, topic.label);
    }

    function topicDescription(topic) {
      return t('regStep2.topics.' + topic.i18nKey + '.description', null, topic.description);
    }

    function renderOptions() {
      // Remember the value before rebuilding, since re-render (on
      // language change) shouldn't lose the participant's selection.
      var currentValue = select.value;
      select.innerHTML = '';

      var placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.disabled = true;
      placeholder.textContent = t('regStep2.topicPlaceholder', null, 'Select your topic');
      select.appendChild(placeholder);

      band.topics.forEach(function (topic) {
        var option = document.createElement('option');
        option.value = topic.value;
        option.textContent = topicLabel(topic);
        select.appendChild(option);
      });

      // Restore a prior selection only if it's still valid for the
      // (re)computed age band; otherwise fall back to the placeholder,
      // per the "clear selection automatically" requirement.
      var candidate = currentValue || previouslySelected;
      var stillValid = candidate && band.topics.some(function (item) {
        return item.value === candidate;
      });
      select.value = stillValid ? candidate : '';
      placeholder.selected = !stillValid;

      updatePreview();
    }

    function updatePreview() {
      var topic = band.topics.filter(function (topicItem) {
        return topicItem.value === select.value;
      })[0];

      if (!topic) {
        if (preview) preview.hidden = true;
        return;
      }

      if (previewTitle) previewTitle.textContent = topicLabel(topic);
      if (previewCopy) previewCopy.textContent = topicDescription(topic);
      if (preview) preview.hidden = false;
    }

    function renderAgeNotice() {
      if (!ageNotice) return;
      ageNotice.textContent = t(
        'regStep2.ageNotice',
        { minAge: band.minAge, maxAge: band.maxAge },
        'Based on your date of birth, you are eligible for topics in the ' + band.minAge + '\u2013' + band.maxAge + ' age category.'
      );
    }

    function renderAll() {
      renderAgeNotice();
      renderOptions();
    }

    renderAll();

    select.addEventListener('change', function () {
      var fieldWrap = select.closest('.contact-form__field');
      if (fieldWrap) fieldWrap.classList.remove('is-invalid');
      updatePreview();
    });

    // Re-render every runtime-generated string when the language
    // switcher fires, since none of this markup exists at the time
    // i18n.js's own DOMContentLoaded pass runs.
    document.addEventListener('gct:langchange', renderAll);

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
