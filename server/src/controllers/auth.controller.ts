import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) {
    throw new AppError('Not authenticated', 401, 'UNAUTHORIZED');
  }

  const { data, error } = await req.supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error) {
    throw new AppError('Profile not found', 404, 'NOT_FOUND');
  }

  res.json({ data });
});
