import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';
import { ZodError } from 'zod';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: { message: err.message, code: err.code },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: err.issues,
      },
    });
    return;
  }

  console.error('Unhandled error:', err);

  res.status(500).json({
    error: {
      message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
      code: 'INTERNAL_ERROR',
    },
  });
};
