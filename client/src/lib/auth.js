// client/src/lib/auth.js

// PostEditor needs the logged-in user's ID to send as authorId.
// Until the server uses requireAuth middleware to get the user
// identity from the token, the client must provide authorId.

const TOKEN_KEY = "inkwell_access_token";
const USER_KEY = "inkwell_user";

// Save authentication token
export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

// Get authentication token
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Remove authentication token
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Save logged-in user information
export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Get logged-in user information
export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

// Remove logged-in user information
export function clearUser() {
  localStorage.removeItem(USER_KEY);
}