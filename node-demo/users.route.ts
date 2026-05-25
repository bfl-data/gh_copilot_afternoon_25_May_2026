import { Router, type Request, type Response } from 'express';
import { randomUUID } from 'node:crypto';

interface CreateUserRequestBody {
  name?: string;
  email?: string;
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const usersByEmail = new Map<string, UserRecord>();

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
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'name and email are required',
        details: [
          {
            field: !name ? 'name' : 'email',
            issue: 'required',
          },
        ],
      },
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (usersByEmail.has(normalizedEmail)) {
    return res.status(409).json({
      error: {
        code: 'USER_EXISTS',
        message: 'A user with this email already exists',
      },
    });
  }

  const user: UserRecord = {
    id: randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
  };

  usersByEmail.set(normalizedEmail, user);

  return res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  });
}

export const usersRouter = Router();
usersRouter.post('/users', createUserHandler);
