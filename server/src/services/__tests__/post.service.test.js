// server/src/services/__tests__/post.service.test.js

import { jest } from "@jest/globals";

// Mock PostRepository
const mockPostRepository = {
  createWithTags: jest.fn(),
};

// Mock EventBus
const mockEventBus = {
  emit: jest.fn(),
};

// Replace real dependencies with mocks
jest.unstable_mockModule(
  "../../repositories/post.repository.js",
  () => ({
    PostRepository: mockPostRepository,
  })
);

jest.unstable_mockModule(
  "../../events/event-bus.js",
  () => ({
    EventBus: mockEventBus,
  })
);

// Import PostService after setting up mocks
const { PostService } = await import("../post.service.js");

// Clear mock history before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Test 1: Publish a post successfully
test("publish() creates a PUBLISHED post and emits post.published", async () => {
  mockPostRepository.createWithTags.mockResolvedValue({
    id: "p1",
    title: "Hello",
    status: "PUBLISHED",
  });

  const post = await PostService.publish({
    authorId: "u1",
    title: "Hello",
    body: "World",
  });

  expect(post.status).toBe("PUBLISHED");

  expect(mockEventBus.emit).toHaveBeenCalledWith(
    "post.published",
    expect.objectContaining({
      postId: "p1",
    })
  );
});

// Test 2: Reject an empty title
test("publish() rejects an empty title", async () => {
  await expect(
    PostService.publish({
      authorId: "u1",
      title: "",
      body: "World",
    })
  ).rejects.toThrow();
});