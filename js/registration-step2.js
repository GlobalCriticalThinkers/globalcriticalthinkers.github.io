/**
 * Global Critical Thinkers — registration-step2.js
 *
 * Step 2 — Research Topic Selection + Preferred Country.
 *
 * TOPIC: The participant never picks an age group directly. Age is
 * derived from the Date of Birth saved by Step 1 (registration-state.js),
 * and that age determines which two-item topic list from
 * registration-data.js's RESEARCH_TOPICS is shown. If Step 1's data is
 * missing (direct page load, cleared session), the participant is sent
 * back to Step 1 rather than shown an empty or wrong-guess dropdown.
 *
 * COUNTRY: A single "preferred country" pick from the full COUNTRIES
 * list already used by Step 1's Country of Residence combo (reused
 * as-is, not duplicated). Rendered as a searchable, scrollable grid of
 * checkbox cards rather than a <select>, per the design brief — this is
 * explicitly a *preference*, not an availability-checked assignment,
 * and the UI (notice text) says so; no availability logic exists here
 * or should be added here.
 *
 * All visible text generated at runtime (topic options, age notice,
 * topic preview, country search placeholder/empty state) is looked up
 * via window.GCTi18n.t() with an English fallback, and re-rendered on
 * the 'gct:langchange' event i18n.js dispatches after a language
 * switch — none of it exists in the DOM at the time i18n.js's own
 * DOMContentLoaded pass runs, so a normal data-i18n sweep can't reach it.
 *
 * Depends on:
 *   - registration-data.js  (RESEARCH_TOPICS, COUNTRIES)
 *   - registration-state.js (window.GCTRegistrationState)
 *   - i18n.js               (window.GCTi18n.t(), 'gct:langchange' event)
 */

(function () {
  'use strict';

  var data = window.GCTRegistrationData || {};
  var topicBands = data.RESEARCH_TOPICS || {};
  var COUNTRIES = data.COUNTRIES || [];

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

  var CHECK_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ------------------------------------------------------------------
     Init
     ------------------------------------------------------------------ */
  function initStep2() {
    var form = document.getElementById('regStep2Form');
    if (!form) return;

    var state = window.GCTRegistrationState;

    /* ==================================================================
       RESEARCH TOPIC
       ================================================================== */
    var select = document.getElementById('rg-topic');
    var preview = document.getElementById('rg-topic-preview');
    var previewTitle = document.getElementById('rg-topic-preview-title');
    var previewCopy = document.getElementById('rg-topic-preview-copy');
    var ageNotice = document.getElementById('rg-topic-age-notice');
    if (!select) return;

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

    var previouslySelectedTopic = state ? state.get('researchTopic') : null;

    function topicLabel(topic) {
      return t('regStep2.topics.' + topic.i18nKey + '.label', null, topic.label);
    }

    function topicDescription(topic) {
      return t('regStep2.topics.' + topic.i18nKey + '.description', null, topic.description);
    }

    function renderTopicOptions() {
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
      var candidate = currentValue || previouslySelectedTopic;
      var stillValid = candidate && band.topics.some(function (item) {
        return item.value === candidate;
      });
      select.value = stillValid ? candidate : '';
      placeholder.selected = !stillValid;

      updateTopicPreview();
    }

    function updateTopicPreview() {
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

    select.addEventListener('change', function () {
      var fieldWrap = select.closest('.contact-form__field');
      if (fieldWrap) fieldWrap.classList.remove('is-invalid');
      updateTopicPreview();
    });

    /* ==================================================================
       PREFERRED COUNTRY
       ================================================================== */
    var countrySearch = document.getElementById('rg-country-search');
    var countryList = document.getElementById('rg-country-list');
    var countryHidden = document.getElementById('rg-preferred-country');
    var hasCountryUI = countrySearch && countryList && countryHidden;

    var selectedCountry = state ? (state.get('preferredCountry') || '') : '';

    // Card nodes are built directly via document.createElement in
    // renderCountryList() below (not an HTML template string), since a
    // handful of COUNTRIES entries contain parentheses/quotes (e.g.
    // "Congo (Congo-Brazzaville)") that would need careful escaping if
    // interpolated into a raw HTML string instead.

    function renderCountryList(filterText) {
      if (!hasCountryUI) return;
      var query = (filterText || '').trim().toLowerCase();
      var matches = query
        ? COUNTRIES.filter(function (name) { return name.toLowerCase().indexOf(query) !== -1; })
        : COUNTRIES;

      countryList.innerHTML = '';

      if (matches.length === 0) {
        var empty = document.createElement('p');
        empty.className = 'reg-country-select__empty';
        empty.textContent = t('regStep2.country.empty', null, 'No countries match your search.');
        countryList.appendChild(empty);
        return;
      }

      var frag = document.createDocumentFragment();
      matches.forEach(function (name) {
        var card = document.createElement('div');
        card.className = 'reg-country-card';
        card.setAttribute('role', 'option');
        card.setAttribute('tabindex', '0');
        card.setAttribute('data-country', name);
        var isSelected = name === selectedCountry;
        card.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        if (isSelected) card.classList.add('is-selected');

        var box = document.createElement('span');
        box.className = 'reg-country-card__box';
        box.innerHTML = CHECK_ICON_SVG;

        var label = document.createElement('span');
        label.className = 'reg-country-card__name';
        label.textContent = name;

        card.appendChild(box);
        card.appendChild(label);
        frag.appendChild(card);
      });
      countryList.appendChild(frag);
    }

    function selectCountry(name) {
      selectedCountry = name;
      countryHidden.value = name;
      countryList.querySelectorAll('.reg-country-card').forEach(function (card) {
        var match = card.getAttribute('data-country') === name;
        card.classList.toggle('is-selected', match);
        card.setAttribute('aria-selected', match ? 'true' : 'false');
      });
      var fieldWrap = countryHidden.closest('.contact-form__field');
      if (fieldWrap) fieldWrap.classList.remove('is-invalid');
    }

    if (hasCountryUI) {
      countryHidden.value = selectedCountry;

      countryList.addEventListener('click', function (event) {
        var card = event.target.closest('.reg-country-card');
        if (!card) return;
        selectCountry(card.getAttribute('data-country'));
      });

      // Keyboard activation for the same role="option" cards, mirroring
      // how .reg-combo__option is mouse-only but this grid is meant to
      // be focusable (tabindex="0" per card).
      countryList.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        var card = event.target.closest('.reg-country-card');
        if (!card) return;
        event.preventDefault();
        selectCountry(card.getAttribute('data-country'));
      });

      countrySearch.addEventListener('input', function () {
        renderCountryList(countrySearch.value);
      });
    }

    /* ==================================================================
       COUNTRY JUSTIFICATION
       ================================================================== */
    var justification = document.getElementById('rg-justification');
    var wordCountEl = document.getElementById('rg-justification-count');
    var justificationErrorRequired = document.getElementById('rg-justification-error-required');
    var justificationErrorMin = document.getElementById('rg-justification-error-min');
    var justificationErrorMax = document.getElementById('rg-justification-error-max');
    var hasJustificationUI = !!justification;

    var JUSTIFICATION_MIN_WORDS = 50;
    var JUSTIFICATION_MAX_WORDS = 200;

    function countWords(text) {
      var trimmed = (text || '').trim();
      if (!trimmed) return 0;
      return trimmed.split(/\s+/).length;
    }

    function updateWordCount() {
      if (!wordCountEl || !justification) return;
      var count = countWords(justification.value);

      wordCountEl.textContent = t(
        'regStep2.justification.wordCount',
        { count: count, max: JUSTIFICATION_MAX_WORDS },
        count + ' / ' + JUSTIFICATION_MAX_WORDS + ' words'
      );

      // Only flag red once the participant has actually typed something
      // and gone out of range — an empty field is caught by the
      // "required" message on submit, not by the live counter turning
      // red before they've started.
      wordCountEl.classList.toggle('is-under', count > 0 && count < JUSTIFICATION_MIN_WORDS);
      wordCountEl.classList.toggle('is-over', count > JUSTIFICATION_MAX_WORDS);
    }

    // Only one of the three justification error messages should be
    // visible at a time (required / too-short / too-long), but the
    // shared .contact-form__field.is-invalid CSS rule reveals every
    // .reg-field__error inside the wrapper indiscriminately. Explicit
    // inline display overrides that generic rule so exactly one message
    // shows — same targeted-message approach phone/email validation
    // already use via their own status element.
    function showJustificationError(kind) {
      var fieldWrap = justification.closest('.contact-form__field');
      if (fieldWrap) fieldWrap.classList.add('is-invalid');

      if (justificationErrorRequired) justificationErrorRequired.style.display = kind === 'required' ? 'block' : 'none';
      if (justificationErrorMin) justificationErrorMin.style.display = kind === 'min' ? 'block' : 'none';
      if (justificationErrorMax) justificationErrorMax.style.display = kind === 'max' ? 'block' : 'none';
    }

    function clearJustificationError() {
      var fieldWrap = justification.closest('.contact-form__field');
      if (fieldWrap) fieldWrap.classList.remove('is-invalid');
      if (justificationErrorRequired) justificationErrorRequired.style.display = '';
      if (justificationErrorMin) justificationErrorMin.style.display = '';
      if (justificationErrorMax) justificationErrorMax.style.display = '';
    }

    // Returns null when valid, otherwise which error to show.
    function validateJustification() {
      var count = countWords(justification.value);
      if (count === 0) return 'required';
      if (count < JUSTIFICATION_MIN_WORDS) return 'min';
      if (count > JUSTIFICATION_MAX_WORDS) return 'max';
      return null;
    }

    if (hasJustificationUI) {
      justification.addEventListener('input', function () {
        updateWordCount();
        clearJustificationError();
      });
    }

    /* ==================================================================
       Shared render/validate/submit
       ================================================================== */
    function renderAll() {
      renderAgeNotice();
      renderTopicOptions();
      if (hasCountryUI) renderCountryList(countrySearch.value);
      if (hasJustificationUI) updateWordCount();
    }

    renderAll();

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

      var firstInvalid = null;

      var topicFieldWrap = select.closest('.contact-form__field');
      if (!select.value) {
        if (topicFieldWrap) topicFieldWrap.classList.add('is-invalid');
        firstInvalid = firstInvalid || topicFieldWrap;
      } else if (topicFieldWrap) {
        topicFieldWrap.classList.remove('is-invalid');
      }

      if (hasCountryUI) {
        var countryFieldWrap = countryHidden.closest('.contact-form__field');
        if (!countryHidden.value) {
          if (countryFieldWrap) countryFieldWrap.classList.add('is-invalid');
          firstInvalid = firstInvalid || countryFieldWrap;
        } else if (countryFieldWrap) {
          countryFieldWrap.classList.remove('is-invalid');
        }
      }

      if (hasJustificationUI) {
        var justificationProblem = validateJustification();
        if (justificationProblem) {
          showJustificationError(justificationProblem);
          firstInvalid = firstInvalid || justification.closest('.contact-form__field');
        } else {
          clearJustificationError();
        }
      }

      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      if (state) {
        state.setMany({
          researchTopic: select.value,
          preferredCountry: hasCountryUI ? countryHidden.value : '',
          countryJustification: hasJustificationUI ? justification.value : ''
        });
      }

      // Step 3 does not exist yet — this is the prepared hand-off point.
      window.location.href = 'register-genesis-step3.html';
    });

    // ------------------------------------------------------------------
    // Restore a previously-typed justification response (e.g. the
    // participant continued to Step 3, then came back). Placed after
    // the submit handler is wired up since it needs updateWordCount,
    // already defined above by this point.
    // ------------------------------------------------------------------
    if (hasJustificationUI && state) {
      var savedJustification = state.get('countryJustification');
      if (savedJustification) {
        justification.value = savedJustification;
        updateWordCount();
      }
    }
  }

  document.addEventListener('DOMContentLoaded', initStep2);
})();
