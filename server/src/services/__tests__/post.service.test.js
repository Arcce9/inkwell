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

// Mock SubstringSearchStrategy
const mockSearchStrategy = {
  search: jest.fn(),
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

jest.unstable_mockModule(
  "../search/substring-search.strategy.js",
  () => ({
    SubstringSearchStrategy: mockSearchStrategy,
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

// SQA-PLAN Section 1.2 Test-Case Design: PostService.search(),
// combining both techniques (same table shape as the
// AuthService.register() design):
//
// # | Technique                              | Input                              | Expected Outcome
// 1 | Black-box (equivalence: valid input)   | query="react", page=1, pageSize=10 | Forwards to strategy unchanged; resolves with its results
// 2 | Black-box (equivalence: no-match)      | query with no matching posts       | Resolves with an empty posts array, hasMore=false
// 3 | Black-box (boundary: pageSize=1)       | pageSize=1 (minimum page size)     | Forwards pageSize=1 unchanged; resolves with strategy's result
// 4 | White-box (branch: defaults engage)    | page/pageSize omitted              | Strategy called with the defaulted page=1, pageSize=10
// 5 | White-box (branch: defaults bypassed)  | page=3, pageSize=25 passed in      | Strategy called with exactly page=3, pageSize=25, not the defaults

describe("PostService.search", () => {

  test("forwards a valid query and returns the strategy's results (row 1)", async () => {
    mockSearchStrategy.search.mockResolvedValue({
      posts: [{ id: "p1", title: "React guide" }],
      hasMore: false,
    });

    const result = await PostService.search({
      query: "react",
      page: 1,
      pageSize: 10,
    });

    expect(mockSearchStrategy.search).toHaveBeenCalledWith("react", {
      page: 1,
      pageSize: 10,
    });
    expect(result.posts).toHaveLength(1);
    expect(result.posts[0].id).toBe("p1");
  });

  test("returns an empty result set for a query with no matches (row 2)", async () => {
    mockSearchStrategy.search.mockResolvedValue({
      posts: [],
      hasMore: false,
    });

    const result = await PostService.search({ query: "zzznotarealword" });

    expect(result.posts).toEqual([]);
    expect(result.hasMore).toBe(false);
  });

  test("forwards a minimum pageSize of 1 unchanged (row 3, boundary)", async () => {
    mockSearchStrategy.search.mockResolvedValue({
      posts: [{ id: "p2" }],
      hasMore: true,
    });

    const result = await PostService.search({
      query: "a",
      page: 1,
      pageSize: 1,
    });

    expect(mockSearchStrategy.search).toHaveBeenCalledWith("a", {
      page: 1,
      pageSize: 1,
    });
    expect(result.hasMore).toBe(true);
  });

  test("applies default page and pageSize when omitted (row 4, white-box branch)", async () => {
    mockSearchStrategy.search.mockResolvedValue({
      posts: [],
      hasMore: false,
    });

    await PostService.search({ query: "react" });

    expect(mockSearchStrategy.search).toHaveBeenCalledWith("react", {
      page: 1,
      pageSize: 10,
    });
  });

  test("uses explicit page and pageSize instead of the defaults (row 5, white-box branch)", async () => {
    mockSearchStrategy.search.mockResolvedValue({
      posts: [],
      hasMore: false,
    });

    await PostService.search({ query: "react", page: 3, pageSize: 25 });

    expect(mockSearchStrategy.search).toHaveBeenCalledWith("react", {
      page: 3,
      pageSize: 25,
    });
  });

});