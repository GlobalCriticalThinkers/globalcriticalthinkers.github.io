/**
 * Global Critical Thinkers — registration-state.js
 *
 * Minimal cross-step persistence for the five-step Genesis registration
 * flow. Nothing before this existed to carry data from one step's page
 * load to the next (registration.js's initStep1Form() validated and
 * navigated, but never saved anything) — this fills that gap so Step 2
 * (and every later step) can read what earlier steps collected.
 *
 * Uses sessionStorage: survives normal forward/back navigation between
 * steps within one registration attempt, but clears when the tab closes
 * or the flow is abandoned, rather than lingering indefinitely like
 * localStorage would for a form containing personal data.
 *
 * Usage:
 *   GCTRegistrationState.set('dateOfBirth', '2012-04-01');
 *   GCTRegistrationState.get('dateOfBirth');           // '2012-04-01'
 *   GCTRegistrationState.setMany({ fullName: '…', dateOfBirth: '…' });
 *   GCTRegistrationState.getAll();                     // whole object
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'gct-registration';

  function readStore() {
    try {
      var raw = window.sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function writeStore(obj) {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch (e) {
      /* sessionStorage unavailable (e.g. private mode) — fail silently,
         same tolerance the rest of the site already applies to
         localStorage in i18n.js */
    }
  }

  function get(key) {
    var store = readStore();
    return store[key];
  }

  function getAll() {
    return readStore();
  }

  function set(key, value) {
    var store = readStore();
    store[key] = value;
    writeStore(store);
  }

  function setMany(fields) {
    var store = readStore();
    Object.keys(fields).forEach(function (key) {
      store[key] = fields[key];
    });
    writeStore(store);
  }

  window.GCTRegistrationState = {
    get: get,
    getAll: getAll,
    set: set,
    setMany: setMany
  };
})();
