import type { Request, Response, NextFunction } from 'express';
import { supabaseAdmin, createSupabaseClient } from '../config/supabase.js';
import { AppError } from '../utils/AppError.js';

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('Missing or invalid authorization header', 401, 'UNAUTHORIZED'));
  }

  const token = header.slice(7);
  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) {
    return next(new AppError('Invalid or expired token', 401, 'UNAUTHORIZED'));
  }

  req.user = data.user;
  req.supabase = createSupabaseClient(token);
  next();
};

export const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next();
  }

  const token = header.slice(7);
  const { data } = await supabaseAdmin.auth.getUser(token);

  if (data.user) {
    req.user = data.user;
    req.supabase = createSupabaseClient(token);
  }

  next();
};
