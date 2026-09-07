import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import * as reviewsService from '../services/reviews.service.js';

export const getMyReview = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  const data = await reviewsService.getReviewForEntry(req.supabase, req.user.id, String(req.params.entryId));
  res.json({ data });
});

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  const data = await reviewsService.createReview(req.supabase, req.user.id, String(req.params.entryId), req.body);
  res.status(201).json({ data });
});

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  const data = await reviewsService.updateReview(req.supabase, String(req.params.id), req.user.id, req.body);
  res.json({ data });
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  await reviewsService.deleteReview(req.supabase, String(req.params.id), req.user.id);
  res.status(204).end();
});

export const getReviewsForTitle = asyncHandler(async (req: Request, res: Response) => {
  if (!req.supabase) throw new AppError('Unauthorized', 401);

  const data = await reviewsService.getReviewsForTitle(
    req.supabase,
    String(req.params.mediaType),
    Number(req.params.tmdbId),
    Number(req.query.page) || 1,
    Number(req.query.limit) || 20,
  );
  res.json({ data });
});

export const getUserReviews = asyncHandler(async (req: Request, res: Response) => {
  if (!req.supabase) throw new AppError('Unauthorized', 401);

  const data = await reviewsService.getUserReviews(
    req.supabase,
    String(req.params.userId),
    Number(req.query.page) || 1,
    Number(req.query.limit) || 20,
  );
  res.json({ data });
});
