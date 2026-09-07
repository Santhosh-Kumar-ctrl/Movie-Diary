import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import * as socialService from '../services/social.service.js';
import * as activityService from '../services/activity.service.js';

export const follow = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  await socialService.follow(req.supabase, req.user.id, String(req.params.userId));
  res.status(201).json({ data: { success: true } });
});

export const unfollow = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  await socialService.unfollow(req.supabase, req.user.id, String(req.params.userId));
  res.json({ data: { success: true } });
});

export const getFollowers = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  const data = await socialService.getFollowers(
    req.supabase,
    req.user.id,
    Number(req.query.page) || 1,
    Number(req.query.limit) || 20,
  );
  res.json({ data });
});

export const getFollowing = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  const data = await socialService.getFollowing(
    req.supabase,
    req.user.id,
    Number(req.query.page) || 1,
    Number(req.query.limit) || 20,
  );
  res.json({ data });
});

export const checkIsFollowing = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  const isFollowing = await socialService.isFollowing(req.supabase, req.user.id, String(req.params.userId));
  res.json({ data: { is_following: isFollowing } });
});

export const getFeed = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  const data = await activityService.getFeed(
    req.supabase,
    req.user.id,
    Number(req.query.page) || 1,
    Number(req.query.limit) || 20,
  );
  res.json({ data });
});
