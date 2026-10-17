// client/src/components/__tests__/PostEditor.test.jsx
//
// A component integration test:
// Renders PostEditor for real, simulates user interaction,
// and mocks only the network boundary (fetch).
//
// React state, event handlers, and rendering are real.

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi, test, expect, beforeEach } from "vitest";
import { PostEditor } from "../PostEditor";

beforeEach(() => {
  global.fetch = vi.fn();
});

test("shows an error message anchored to the form when publish fails", async () => {
  // Mock failed API response
  global.fetch.mockResolvedValue({
    ok: false,
    json: async () => ({
      error: {
        message: "Title is required.",
      },
    }),
  });

  // Render PostEditor
  render(<PostEditor />, {
    wrapper: MemoryRouter,
  });

  // Simulate user typing into the title and body fields.
  // The title input has a native `required` attribute, so jsdom's
  // own HTML5 form validation would block submission (and the
  // mocked fetch below would never run) if it were left empty.
  await userEvent.type(
    screen.getByLabelText(/title/i),
    "Some title"
  );

  await userEvent.type(
    screen.getByLabelText(/body/i),
    "Some content"
  );

  // Simulate clicking the Publish button
  await userEvent.click(
    screen.getByRole("button", {
      name: /publish/i,
    })
  );

  // Verify error message appears
  expect(
    await screen.findByRole("alert")
  ).toHaveTextContent("Title is required.");
});