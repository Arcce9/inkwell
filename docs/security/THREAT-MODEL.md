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
| GET /api/posts | An unbounded `pageSize` lets a client force the DB query and response payload to scale to an arbitrary size on every unauthenticated request | Denial of Service | Medium | Medium | Medium | Clamp `pageSize` to a fixed maximum at the route boundary (Section 5.6) |

### Hardening Log
- 2026 — Lecture 15: Fixed authorId spoofing vulnerability (S
ection 1.2)
- 2026 — Lecture 15: Added allowlist-based user DTO to preven
t field leakage (Section 1.3)
- 2026 — Lecture 15: Added rate limiting to auth endpoints (S
ection 1.4)
- 2026 — Lecture 15: Verified stored-XSS resistance with regr
ession test (Section 1.5)
- 2026 — Lecture 15: Clamped GET /api/posts `pageSize` to a m
aximum of 50 to prevent unbounded-pagination DoS (Section 1.6
)
### Security Measurement Baseline
- Vulnerabilities found this pass: 5 (all remediated)
- Security test coverage: 2 of 4 attack-surface endpoints has
a dedicated security regression test
- Maturity note: Inkwell's security practice is currently ad
hoc/reactive
(a single hardening pass), not yet an ongoing program — the
honest, named starting point
for future improvement, not a finished state.