import type { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

interface ValidationSchemas {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

export const validate = (schemas: ValidationSchemas) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }
    if (schemas.params) {
      req.params = schemas.params.parse(req.params) as typeof req.params;
    }
    if (schemas.query) {
      req.query = schemas.query.parse(req.query) as typeof req.query;
    }
    next();
  };
