// Demo state: password hashing logic is inlined into this controller.
// During Module 4.5 (Agent Mode demo), Copilot is asked to extract this
// into src/services/password-service.ts, update imports, and add a unit test.
// Do NOT pre-refactor this file before the session.

import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { logger } from '../lib/logger.js';

type AuthBody = { email?: string; password?: string };
type AuthCredentials = { email: string; password: string };
type UserRecord = { id: string; email: string; passwordHash: string };

const SALT_ROUNDS = 12;
const ERROR_MISSING_CREDENTIALS = 'email and password are required';
const ERROR_EMAIL_REGISTERED = 'email already registered';
const ERROR_INVALID_CREDENTIALS = 'invalid credentials';

// In-memory user store for the demo. Keyed by email.
const users = new Map<string, UserRecord>();

const getCredentials = (req: Request): AuthBody => req.body as AuthBody;

const hasCredentials = (body: AuthBody): body is AuthCredentials => Boolean(body.email && body.password);

const missingCredentials = (res: Response) => res.status(400).json({ error: ERROR_MISSING_CREDENTIALS });

export const authController = {
  register: async (req: Request, res: Response) => {
    const credentials = getCredentials(req);
    if (!hasCredentials(credentials)) {
      return missingCredentials(res);
    }

    const { email, password } = credentials;

    if (users.has(email)) {
      return res.status(409).json({ error: ERROR_EMAIL_REGISTERED });
    }

    // Inline password hashing — extract me into a password service
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const id = crypto.randomUUID();
    users.set(email, { id, email, passwordHash });

    logger.info({ email }, 'User registered');
    return res.status(201).json({ id, email });
  },

  login: async (req: Request, res: Response) => {
    const credentials = getCredentials(req);
    if (!hasCredentials(credentials)) {
      return missingCredentials(res);
    }

    const { email, password } = credentials;

    const user = users.get(email);
    if (!user) {
      return res.status(401).json({ error: ERROR_INVALID_CREDENTIALS });
    }

    // Inline password verification — extract me into a password service
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      logger.warn({ email }, 'Login failed: bad password');
      return res.status(401).json({ error: ERROR_INVALID_CREDENTIALS });
    }

    logger.info({ email }, 'User logged in');
    return res.status(200).json({ id: user.id, email: user.email });
  },
};
