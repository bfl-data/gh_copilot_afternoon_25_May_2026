import { Router, type Request, type Response } from 'express';
import { randomUUID } from 'node:crypto';

export interface CreateUserRequestBody {
  name?: string;
  email?: string;
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

type CreateUserField = 'name' | 'email';

const usersByEmail = new Map<string, UserRecord>();

function createValidationErrorResponse(field: CreateUserField) {
  return {
    error: {
      code: 'VALIDATION_ERROR',
      message: 'name and email are required',
      details: [
        {
          field,
          issue: 'required',
        },
      ],
    },
  };
}

function createUserExistsResponse() {
  return {
    error: {
      code: 'USER_EXISTS',
      message: 'A user with this email already exists',
    },
  };
}

function createUserResponse(user: UserRecord) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

/**
 * Creates a new user.
 * @param req Express request with `name` and `email` in the body.
 * @param res Express response.
 * @returns A JSON response with the created user ID and profile.
 * @throws Returns HTTP 400 if required fields are missing.
 * @throws Returns HTTP 409 if the email already exists.
 * @example
 * POST /users
 * {
 *   "name": "Ada Lovelace",
 *   "email": "ada@example.com"
 * }
 */
export async function createUserHandler(
  req: Request<unknown, unknown, CreateUserRequestBody>,
  res: Response,
): Promise<Response> {
  const { name, email } = req.body;

  if (!name || !email) {
    const missingField: CreateUserField = !name ? 'name' : 'email';
    return res.status(400).json(createValidationErrorResponse(missingField));
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (usersByEmail.has(normalizedEmail)) {
    return res.status(409).json(createUserExistsResponse());
  }

  const user: UserRecord = {
    id: randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
  };

  usersByEmail.set(normalizedEmail, user);

  return res.status(201).json(createUserResponse(user));
}

export const usersRouter = Router();
usersRouter.post('/users', createUserHandler);
