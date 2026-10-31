// server/src/routes/__tests__/auth.integration.test.js
//
// Integration test: exercises the real AuthService and TokenService
// end-to-end through the real Express app (via supertest). Only the
// persistence boundary (UserRepository) is faked, with an in-memory
// store standing in for the database — this is what actually proves
// registration and login work TOGETHER: login's lookup must find the
// user register's create() just wrote, and bcrypt.compare must
// succeed against the real hash register() produced.
//
// PostService is stubbed only so app.js's unconditional post.routes.js
// mount can load without needing a real DATABASE_URL.

import { jest } from "@jest/globals";
import request from "supertest";

let users = [];
let nextId = 1;

const mockUserRepository = {
  findByEmail: jest.fn((email) =>
    Promise.resolve(users.find((u) => u.email === email) ?? null)
  ),
  create: jest.fn(({ email, displayName, passwordHash }) => {
    const user = { id: String(nextId++), email, displayName, passwordHash };
    users.push(user);
    return Promise.resolve(user);
  }),
};

jest.unstable_mockModule("../../repositories/user.repository.js", () => ({
  UserRepository: mockUserRepository,
}));

jest.unstable_mockModule("../../services/post.service.js", () => ({
  PostService: {
    publish: jest.fn(),
    listPublished: jest.fn(),
    search: jest.fn(),
  },
}));

const { app } = await import("../../app.js");

beforeEach(() => {
  users = [];
  nextId = 1;
  jest.clearAllMocks();
});

test("a registered user can log in with the same credentials", async () => {
  const registerRes = await request(app).post("/api/auth/register").send({
    email: "alice@example.com",
    displayName: "Alice",
    password: "correcthorse",
  });

  expect(registerRes.status).toBe(201);
  expect(registerRes.body.user.email).toBe("alice@example.com");
  expect(registerRes.body.user.passwordHash).toBeUndefined();
  expect(registerRes.body.accessToken).toBeDefined();

  const loginRes = await request(app).post("/api/auth/login").send({
    email: "alice@example.com",
    password: "correcthorse",
  });

  expect(loginRes.status).toBe(200);
  expect(loginRes.body.user.id).toBe(registerRes.body.user.id);
  expect(loginRes.body.user.passwordHash).toBeUndefined();
  expect(loginRes.body.accessToken).toBeDefined();
});
