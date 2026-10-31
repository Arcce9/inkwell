// server/src/services/auth.service.js

import bcrypt from "bcrypt";
import { logger } from "../lib/logger.js";
import { toPublicUser } from "../dto/user.dto.js";
import { UserRepository } from "../repositories/user.repository.js";
import { assertNonEmpty, ValidationError } from "../utils/validation.js";
import { TokenService } from "./token.service.js";

class EmailAlreadyRegisteredError extends Error {}
class WeakPasswordError extends Error {}
class InvalidCredentialsError extends Error {}

const MIN_PASSWORD_LENGTH = 8;

export const AuthService = {
  async register({ email, displayName, password }) {
    assertNonEmpty(email, "email", "MISSING_EMAIL");
    assertNonEmpty(displayName, "displayName", "MISSING_DISPLAY_NAME");
    assertNonEmpty(password, "password", "MISSING_PASSWORD");

    const existing = await UserRepository.findByEmail(email);

    if (existing) {
      throw new EmailAlreadyRegisteredError();
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new WeakPasswordError();
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let user;

    try {
      user = await UserRepository.create({
        email,
        displayName,
        passwordHash,
      });
    } catch {
      // findByEmail already confirmed the address was free, so a create()
      // failure here means a concurrent registration won the race.
      throw new EmailAlreadyRegisteredError();
    }

    const tokens = TokenService.issueTokens(user);

    return {
      user: toPublicUser(user),
      ...tokens,
    };
  },

  async login({ email, password }) {
    const user = await UserRepository.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      // A09's fix: Structured, leveled, machine-parseable
      // security logging for failed login attempts.
      logger.warn(
        {
          event: "auth.login.failed",
          email,
        },
        "Failed login attempt"
      );

      throw new InvalidCredentialsError();
    }

    const tokens = TokenService.issueTokens(user);

    return {
      user: toPublicUser(user),
      ...tokens,
    };
  },
};

export {
  EmailAlreadyRegisteredError,
  WeakPasswordError,
  InvalidCredentialsError,
  ValidationError,
};