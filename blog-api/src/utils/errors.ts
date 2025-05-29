import { ZodError } from 'zod';
import { Response } from 'express';

export class NotFoundError extends Error {
  statusCode = 404;
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error {
  statusCode = 401;
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  statusCode = 403;
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class BadRequestError extends Error {
  statusCode = 400;
  constructor(message = 'Bad request') {
    super(message);
    this.name = 'BadRequestError';
  }
}

export const handleZodError = (error: ZodError, res: Response): void => {
  const formatted = error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));

  res.status(400).json({ errors: formatted });
};