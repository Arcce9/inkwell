// server/src/routes/__tests__/posts.integration.test.js
//
// Integration test: a real Express app (via supertest) routed through
// the real post.routes.js, with only the Service layer mocked —
// the same boundary the unit tests mock, one level up the stack.
// AuthService is stubbed too, only so app.js's unconditional
// auth.routes.js mount can load without needing a real DATABASE_URL.

import { jest } from "@jest/globals";
import request from "supertest";

const mockPostService = {
  publish: jest.fn(),
  listPublished: jest.fn(),
  search: jest.fn(),
};

jest.unstable_mockModule("../../services/post.service.js", () => ({
  PostService: mockPostService,
}));

jest.unstable_mockModule("../../services/auth.service.js", () => ({
  AuthService: { register: jest.fn(), login: jest.fn() },
  EmailAlreadyRegisteredError: class EmailAlreadyRegisteredError extends Error {},
  WeakPasswordError: class WeakPasswordError extends Error {},
  InvalidCredentialsError: class InvalidCredentialsError extends Error {},
}));

const { app } = await import("../../app.js");

beforeEach(() => {
  jest.clearAllMocks();
});

test("POST /api/posts publishes a post and returns 201", async () => {
  mockPostService.publish.mockResolvedValue({
    id: "p1",
    title: "Hello",
    status: "PUBLISHED",
  });

  const res = await request(app)
    .post("/api/posts")
    .send({ authorId: "u1", title: "Hello", body: "World" });

  expect(res.status).toBe(201);
  expect(res.body).toMatchObject({ id: "p1", status: "PUBLISHED" });
  expect(mockPostService.publish).toHaveBeenCalledWith({
    authorId: "u1",
    title: "Hello",
    body: "World",
    tagNames: undefined,
  });
});

test("POST /api/posts returns 400 with the error envelope when the service rejects", async () => {
  const err = new Error("title is required.");
  err.code = "MISSING_TITLE";
  mockPostService.publish.mockRejectedValue(err);

  const res = await request(app)
    .post("/api/posts")
    .send({ authorId: "u1", title: "", body: "World" });

  expect(res.status).toBe(400);
  expect(res.body).toEqual({
    error: { code: "MISSING_TITLE", message: "title is required." },
  });
});

test("GET /api/posts lists published posts when no search query is given", async () => {
  mockPostService.listPublished.mockResolvedValue({
    posts: [{ id: "p1" }],
    page: 1,
    hasMore: false,
  });

  const res = await request(app).get("/api/posts");

  expect(res.status).toBe(200);
  expect(res.body.posts).toHaveLength(1);
  expect(mockPostService.listPublished).toHaveBeenCalledWith({ page: 1 });
  expect(mockPostService.search).not.toHaveBeenCalled();
});

test("GET /api/posts?search= routes to PostService.search instead of listPublished", async () => {
  mockPostService.search.mockResolvedValue({
    posts: [{ id: "p2", title: "React guide" }],
    hasMore: false,
  });

  const res = await request(app).get("/api/posts").query({ search: "react", page: 2 });

  expect(res.status).toBe(200);
  expect(res.body.posts[0].id).toBe("p2");
  expect(mockPostService.search).toHaveBeenCalledWith({ query: "react", page: 2 });
  expect(mockPostService.listPublished).not.toHaveBeenCalled();
});
