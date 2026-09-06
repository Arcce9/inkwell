# Inkwell Server Module Structure — v1
## Routes / Controllers (boundary classes)- Receive HTTP requests, call the correct service, return HTTP 
responses.- Never query Prisma or the database directly.
## Services- **AuthService** (pure fabrication) — password hashing, verif
ication, token issuance.- **PostService** (controller/coordinator) — business rules fo
r posts: duplicate checks, ownership, draft/published transiti
ons.
## Repositories (persistence classes)- **UserRepository**, **PostRepository** — the only modules th
at talk to Prisma / the database directly.
## Dependency flow
Routes -> AuthService -> UserRepository -> PostgreSQL
Routes -> PostService -> PostRepository -> PostgreSQL
Modules pass simple data objects to each other; none depends o
n another's internal implementation details.