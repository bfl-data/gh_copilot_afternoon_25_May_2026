import type { Request, Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

interface CreateUserRequestBody {
  name?: string;
  email?: string;
}

type CreateUserHandler = (
  req: Request<unknown, unknown, CreateUserRequestBody>,
  res: Response,
) => Promise<Response>;

function createMockRequest(
  body: CreateUserRequestBody,
): Request<unknown, unknown, CreateUserRequestBody> {
  return {
    body,
  } as Request<unknown, unknown, CreateUserRequestBody>;
}

function createMockResponse(): {
  response: Response;
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
} {
  const status = vi.fn();
  const json = vi.fn();

  const response = {
    status,
    json,
  } as unknown as Response;

  status.mockReturnValue(response);
  json.mockReturnValue(response);

  return {
    response,
    status,
    json,
  };
}

describe('createUserHandler', () => {
  let createUserHandler: CreateUserHandler;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-25T12:00:00.000Z'));

    ({ createUserHandler } = await import('./users.route.js'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns 400 when name is missing', async () => {
    const request = createMockRequest({
      email: 'missing-name@example.com',
    });
    const { response, status, json } = createMockResponse();

    await createUserHandler(request, response);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'name and email are required',
        details: [
          {
            field: 'name',
            issue: 'required',
          },
        ],
      },
    });
  });

  it('returns 400 when email is missing', async () => {
    const request = createMockRequest({
      name: 'Ada Lovelace',
    });
    const { response, status, json } = createMockResponse();

    await createUserHandler(request, response);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'name and email are required',
        details: [
          {
            field: 'email',
            issue: 'required',
          },
        ],
      },
    });
  });

  it('creates a user with normalized email and trimmed name', async () => {
    const request = createMockRequest({
      name: '  Ada Lovelace  ',
      email: '  ADA.NORMALIZED@example.com  ',
    });
    const { response, status, json } = createMockResponse();

    await createUserHandler(request, response);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({
      id: expect.any(String),
      name: 'Ada Lovelace',
      email: 'ada.normalized@example.com',
      createdAt: '2026-05-25T12:00:00.000Z',
    });
  });

  it('returns 409 when the normalized email already exists', async () => {
    const firstRequest = createMockRequest({
      name: 'First User',
      email: 'duplicate@example.com',
    });
    const firstResponse = createMockResponse();

    await createUserHandler(firstRequest, firstResponse.response);

    const secondRequest = createMockRequest({
      name: 'Second User',
      email: '  DUPLICATE@example.com  ',
    });
    const { response, status, json } = createMockResponse();

    await createUserHandler(secondRequest, response);

    expect(status).toHaveBeenCalledWith(409);
    expect(json).toHaveBeenCalledWith({
      error: {
        code: 'USER_EXISTS',
        message: 'A user with this email already exists',
      },
    });
  });
});
