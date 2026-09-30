// server/src/middleware/authenticate.js
//
// Verifies the Bearer access token and attaches the caller's identity
// to req.user. Routes read req.user.id instead of trusting a
// client-supplied authorId.
import { TokenService } from "../services/token.service.js";

export function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Missing or invalid Authorization header." },
    });
  }

  try {
    const payload = TokenService.verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Invalid or expired token." },
    });
  }
}
