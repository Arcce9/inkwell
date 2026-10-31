# Test-Case Design: PostService.search()

Combining both techniques, same table shape as the Section 1.2 design for
`AuthService.register()`. `PostService.search()` has no validation logic of
its own — it forwards `query`/`page`/`pageSize` to `SubstringSearchStrategy`,
with default parameters (`page = 1`, `pageSize = 10`) as its only real branch.
Tests mock `SubstringSearchStrategy` the same way existing tests mock
`PostRepository`/`EventBus`.

| # | Technique | Input | Expected Outcome |
|---|-----------|-------|-------------------|
| 1 | Black-box (equivalence: valid input) | `query="react", page=1, pageSize=10` | Forwards to the strategy unchanged; resolves with its results |
| 2 | Black-box (equivalence: no-match partition) | Query with no matching posts | Resolves with an empty `posts` array, `hasMore=false` |
| 3 | Black-box (boundary: pageSize=1) | `pageSize=1` (minimum page size) | Forwards `pageSize=1` unchanged; resolves with the strategy's result |
| 4 | White-box (branch: defaults engage) | `page`/`pageSize` omitted | Strategy called with the defaulted `page=1, pageSize=10` |
| 5 | White-box (branch: defaults bypassed) | `page=3, pageSize=25` passed in | Strategy called with exactly `page=3, pageSize=25`, not the defaults |

Implemented in `server/src/services/__tests__/post.services.test.js`
(`describe("PostService.search", ...)`). Full suite: 13/13 passing (8
pre-existing `AuthService`/`PostService.publish` tests + 5 new).
