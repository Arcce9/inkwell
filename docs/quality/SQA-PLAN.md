# Inkwell SQA Plan — v1
## Standards
- All code changes follow the PR checklist (docs/reviews, .gi
thub/PULL_REQUEST_TEMPLATE.md)
- Architecture conformance per ADR-001 (docs/architecture/adr
-001-modular.monolith.md)
- API contract conventions per docs/design/api-contract.md
## Reviews
- Every merged change is self-reviewed (author) then peer-rev
iewed before merge
- Review findings logged in docs/reviews/
## Testing (expanded in Lecture 12-14)
- Unit tests: Services and Repositories (Jest) — starting Lec
ture 12
- Integration tests: Routes (Supertest) — starting Lecture 13
- End-to-end tests: critical user flows (Playwright) — starti
ng Lecture 14
## Defect Tracking
- All discovered defects (via review, testing, or manual use)
recorded in docs/quality/DEFECT-LOG.md
- Each entry records: cause category, discovery stage, and re
mediation
## Metrics Tracked
- Defects per lecture/increment
- Defect cause category distribution
- Review turnaround (informal, tracked qualitatively at this
project's scale)
## Ownership
- For this course project: the student/team implementing Inkw
ell owns SQA plan adherence.
## Metrics Snapshot (as of 2026-10-07)
- Commits: 16 (`git log --oneline`)
- Logged defects: 2 (docs/quality/DEFECT-LOG.md: D-001, D-002)
- Backlog items at "Requirements Defined" or later: 4 of 9 (US-01, US-02, US-03, US-04 — see docs/BACKLOG.md)
## Testing
- Unit tests: Services and Repositories (Jest) — ACTIVE (Lect
ure 12)
- Integration tests: Routes → Services → Repositories, real test DB (Supertest) — ACTIVE (Lecture 13)
- Component tests: React components (RTL) — ACTIVE (Lecture 13)
- End-to-end tests: critical user flows (Playwright) — starting Lecture 14
## Integration Test Log
- Registration + login (`server/src/routes/__tests__/auth.integration.test.js`): registers a user via `POST /api/auth/register`, then logs in with the same credentials via `POST /api/auth/login`, through the real `AuthService`/`TokenService` (real bcrypt hashing/comparison, real JWT signing). Only `UserRepository` is faked (in-memory store). Proves the two endpoints work together — login's lookup must find what register's create() wrote, and bcrypt.compare must succeed against the real hash register() produced, not just that each endpoint passes its own unit tests.

## Testing (docs/quality/SQA-PLAN.md)
- Unit tests: Services and Repositories (Jest) — ACTIVE (Lect ure 12)- Integration tests: Routes → Services → Repositories, real t est DB (Supertest) — ACTIVE (Lecture 13)- Component tests: React components (RTL) — ACTIVE (Lecture 1 3)- End-to-end tests: critical user flows, mobile + desktop vie wports (Playwright) — ACTIVE (Lecture 14)- Automated accessibility checks (axe-core) — ACTIVE (Lecture 14)- Documentation verification (README, Section 4.10) — ACTIVE (Lecture 14)- Security testing — starting Lecture 15- Performance/load testing — deferred; revisit at Lecture 1920 (architecture scale-out)