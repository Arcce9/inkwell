// Remove server-only fields before returning user data.
export function toPublicUser(user) {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}
