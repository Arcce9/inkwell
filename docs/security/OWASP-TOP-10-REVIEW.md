| # | Category | Status in Inkwell | Action |
|---|---|---|---|
| A01 | Broken Access Control | Found: comments/posts endpoin
ts did not verify ownership before edit/delete | Fixed — Sect
ion 1.2 |
| A02 | Cryptographic Failures | Passwords already hashed wit
h bcrypt (Lecture 6); found: JWT secret was a weak, hardcoded
string | Fixed — Section 1.3 |
| A03 | Injection | Prisma's parameterized queries already pr
event SQL injection by default; verified, not fixed | No acti
on needed, verified only |
| A04 | Insecure Design | Covered via Lecture 15's threat mod
eling; no new gap found this pass | No action needed |
| A05 | Security Misconfiguration | Found: detailed stack tra
ces returned to the client in production mode | Fixed — Secti
on 1.4 |
| A06 | Vulnerable/Outdated Components | Addressed by `npm au
dit` (introduced this lecture) | Fixed — Section 1.5 |
| A07 | Authentication Failures | Rate limiting already added
(Lecture 15) | No new action needed |
| A08 | Software/Data Integrity | Deferred — full treatment i
n Lecture 20/21's pipeline integrity discussion | Deferred, f
lagged |
| A09 | Logging/Monitoring Failures | Found: no logging at al
l on failed login attempts | Fixed — Section 1.6 |
| A10 | SSRF | Not yet applicable — no feature fetches a user
-supplied URL; flagged for when avatar-by-URL is built | Flag
ged for future work |
