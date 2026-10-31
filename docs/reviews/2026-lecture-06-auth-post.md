# Review: Auth and Post Services (Lecture 6, persistence from Lecture 8)

**Reviewer prep time:** Not recorded
**Defects found:** 4 (plus 2 notes)
**Outcome:** Request changes

Findings:

1. **Internal errors reach the client.** `auth.routes.js` (register and login catch blocks) and `post.routes.js` (publish catch block) return `err.message` with a 400 for any error, including unexpected database failures. Routes should map only typed errors to client messages and return a generic 500 for everything else.
2. **`tagNames` is not validated.** `PostService.publish` passes `tagNames` straight to `PostRepository.createWithTags`. A non-array or a non-string entry surfaces as a raw Prisma error. The service should validate it and throw a typed error.
3. **Inconsistent post shape.** `searchPublished` includes `author { id, displayName }`, but `findPublished` does not. `GET /api/posts` and `GET /api/posts?search=` return different shapes for the same post.
4. **Engines constraint missing.** `server/package.json` has no `engines` field, so the Lecture 10 follow-up is not applied.

Notes (not defects):

- Checklist item "Only files inside `repositories/` import `@prisma/client`" conflicts with `server/src/db/client.js`, which must import it. The checklist needs an exemption for `db/client.js`.
- The service file is named `auth.services.js`, while course documents and header comments say `auth.service.js`. Header comments also reference the old path.
- Not verified: the Lecture 8 mobile layout and keyboard/accessibility checks were not tested in a browser.

See `.github/PULL_REQUEST_TEMPLATE.md` for the checklist this review followed.
