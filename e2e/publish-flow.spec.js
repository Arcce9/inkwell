// e2e/publish-flow.spec.js

import { test, expect, devices } from "@playwright/test";

// Test the same user journey on mobile and desktop.
const viewports = [
  {
    name: "mobile",
    viewport: devices["iPhone 13"].viewport,
  },
  {
    name: "desktop",
    viewport: { width: 1280, height: 800 },
  },
];

for (const viewport of viewports) {
  test.describe(`publish flow — ${viewport.name}`, () => {
    test.use({ viewport: viewport.viewport });

    test("a registered user can log in and publish a post", async ({
      page,
      request,
    }) => {
      // Use a unique email and title for each test run.
      // This prevents duplicate accounts and posts.
      const runId = Date.now();

      const email = `e2e-${viewport.name}-${runId}@example.com`;
      const title = `Hello from ${viewport.name} (${runId})`;

      // Step 1: Register a new user through the API.
      const registerRes = await request.post(
        "http://localhost:4000/api/auth/register",
        {
          data: {
            email,
            displayName: "E2E Tester",
            password: "correcthorse",
          },
        }
      );

      expect(registerRes.ok()).toBe(true);

      // Step 2: Open the login page.
      await page.goto("http://localhost:5173/login");

      // Step 3: Enter login information.
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password").fill("correcthorse");

      // Step 4: Log in.
      await page.getByRole("button", { name: "Log In" }).click();

      // Verify successful login redirects to the homepage.
      await expect(page).toHaveURL("http://localhost:5173/");

      // Step 5: Navigate to the post editor.
      await page.getByRole("link", { name: "Write" }).click();

      // Step 6: Enter the post title and body.
      await page.getByLabel("Title").fill(title);

      await page
        .getByLabel("Body")
        .fill("Published end to end.");

      // Step 7: Publish the post.
      await page.getByRole("button", { name: "Publish" }).click();

      // Step 8: Verify navigation back to the homepage.
      await expect(page).toHaveURL("http://localhost:5173/");

      // Step 9: Verify the published post appears in the feed.
      await expect(
        page.getByRole("heading", { name: title })
      ).toBeVisible();
    });
  });
}