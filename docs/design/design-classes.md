# Inkwell Design Classes — v1
## User (entity)- id: string- email: string (unique)- displayName: string- passwordHash: string- isVerified: boolean- createdAt: DateTime
+ verifyPassword(plain: string): boolean
## Post (entity)- id: string- authorId: string- title: string- body: string- status: PostStatus (DRAFT | PUBLISHED)- publishedAt: DateTime | null- createdAt: DateTime
+ publish(): void
+ isEditableBy(userId: string): boolean
Relationship: User "1" --> "*" Post (authors)
### Design decisions- **Post.status uses fixed values (DRAFT, PUBLISHED), not free 
text.** Catches typos like "publised" early. Tradeoff: adding 
ARCHIVED later requires a schema change.- **authorId is stored directly on Post.** Each post has exact
ly one author, so no join table is needed; a join table would 
only be justified if posts could have multiple authors.- **AuthService, not User, owns password hashing and verificat
ion.** Keeps User focused on representing user data; hashing m
ethod can change later without touching User.