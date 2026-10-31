// client/src/test-setup.js
//
// Loaded before every test file (see vite.config.js's test.setupFiles).
// Extends vitest's expect with jest-dom matchers (toBeInTheDocument,
// toHaveTextContent, etc.) used by component tests.

import "@testing-library/jest-dom/vitest";
