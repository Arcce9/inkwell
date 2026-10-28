// client/src/components/__tests__/PostCard.security.test.jsx
//
// Section 5.1, row 4's mitigation, verified as a regression test:
// A post body containing a script tag must render as inert text,
// never as executable markup.

import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import { PostCard } from "../PostCard";

test("renders post body as text, never as executable HTML", () => {
  const maliciousPost = {
    id: "1",
    title: "Test",
    body: "<script>window.__xss = true;</script>",
    author: { displayName: "Attacker" },
  };

  render(<PostCard post={maliciousPost} />);

  // Verify that the script tag is rendered as literal text.
  expect(screen.getByText(/<script>/)).toBeInTheDocument();

  // Verify that the malicious JavaScript was never executed.
  expect(window.__xss).toBeUndefined();
});