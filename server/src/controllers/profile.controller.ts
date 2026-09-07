import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import * as profileService from '../services/profile.service.js';

export const getMyProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  const data = await profileService.getProfile(req.supabase, req.user.id);
  res.json({ data });
});

export const updateMyProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  const data = await profileService.updateProfile(req.supabase, req.user.id, req.body);
  res.json({ data });
});

export const getPublicProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.supabase) throw new AppError('Unauthorized', 401);

  const data = await profileService.getProfile(req.supabase, String(req.params.userId));
  res.json({ data });
});

export const searchUsers = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  const query = String(req.query.q || '');
  if (query.length < 2) {
    res.json({ data: [] });
    return;
  }

  const data = await profileService.searchUsers(req.supabase, query, Number(req.query.limit) || 10);
  res.json({ data });
});
