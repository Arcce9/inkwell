# Inkwell API Contract — v1
## POST /api/auth/register
Request: { email: string, displayName: string, password: strin
g }
Success: 201 { user: UserPublic, accessToken: string, refreshT
oken: string }
Errors:
400 EMAIL_ALREADY_REGISTERED  — "This email is already regis
tered."
400 WEAK_PASSWORD             — "Password does not meet stre
ngth requirements."
## POST /api/auth/login
Request: { email: string, password: string }
Success: 200 { user: UserPublic, accessToken: string, refreshT
oken: string }
Errors:
401 INVALID_CREDENTIALS       — "Invalid email or password."
## GET /api/posts?page=n
Success: 200 { posts: PostPublic[], page: number, hasMore: boo
lean }