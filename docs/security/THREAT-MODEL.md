## Attack Surface

- POST /api/auth/register — Unauthenticated, accepts email/displayName/password
- POST /api/auth/login — Unauthenticated, accepts email/password
- POST /api/posts — Authenticated, accepts title/body/tags
- GET /api/posts — Unauthenticated, returns a paginated feed
- JWT access tokens — Bearer tokens sent in the Authorization header

## STRIDE Analysis, with Risk Rating

| Component | Threat | Category | Likelihood | Impact | Risk Rating | Mitigation |
|---|---|---|---|---|---|---|
| POST /api/posts | A user forges another user's `authorId` to publish as them | Spoofing | High | High | Critical | Derive the author from the authenticated token; never trust a client-supplied `authorId` (Section 5.2) |
| GET /api/posts | The response includes fields beyond what the feed needs (e.g., email) | Information Disclosure | High | Medium | High | Explicit response shaping / DTO (Section 5.3) |
| POST /api/auth/login | Unlimited login attempts enable brute-force credential guessing | Denial of Service / Broken Authentication | Medium | High | High | Rate limiting (Section 5.4) |
| POST /api/posts | Untrusted `body` content is rendered without sanitization on the client, enabling stored XSS | Tampering / Information Disclosure | Medium | High | High | Output encoding on render (Section 5.5) |