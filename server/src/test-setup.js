import "@testing-library/jest-dom";

// Verification note:
// On this Node version, Node's built-in (experimental) global
// localStorage shadows jsdom's working implementation with a
// broken stub whose methods (getItem/setItem/etc.) are not functions.
//
// Any component that reads localStorage (e.g. PostEditor's getToken())
// throws inside its try/catch and silently falls into the generic
// error path instead of the one being tested.
//
// A minimal in-memory polyfill avoids this conflict.

if (typeof window.localStorage?.getItem !== "function") {
  const store = new Map();

  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      getItem: (key) =>
        store.has(key) ? store.get(key) : null,

      setItem: (key, value) =>
        store.set(key, String(value)),

      removeItem: (key) =>
        store.delete(key),

      clear: () =>
        store.clear(),
    },
  });
}