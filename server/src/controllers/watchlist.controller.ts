import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import * as watchlistService from '../services/watchlist.service.js';

export const getWatchlist = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  const data = await watchlistService.getUserWatchlist(req.supabase, req.user.id, {
    status: req.query.status as string | undefined,
    mediaType: req.query.mediaType as string | undefined,
    sort: req.query.sort as string | undefined,
    order: req.query.order as string | undefined,
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 20,
  });

  res.json({ data });
});

export const getEntryById = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  const data = await watchlistService.getEntry(req.supabase, String(req.params.id));
  res.json({ data });
});

export const addToWatchlist = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  const data = await watchlistService.addEntry(req.supabase, req.user.id, req.body);
  res.status(201).json({ data });
});

export const updateWatchlistStatus = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  const data = await watchlistService.updateStatus(req.supabase, String(req.params.id), req.user.id, req.body.status);
  res.json({ data });
});

export const removeFromWatchlist = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  await watchlistService.removeEntry(req.supabase, String(req.params.id), req.user.id);
  res.status(204).end();
});

export const checkWatchlistEntry = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  const data = await watchlistService.checkEntry(
    req.supabase,
    req.user.id,
    String(req.params.mediaType),
    Number(req.params.tmdbId),
  );
  res.json({ data });
});

export const getPublicWatchlist = asyncHandler(async (req: Request, res: Response) => {
  if (!req.supabase) throw new AppError('Unauthorized', 401);

  const data = await watchlistService.getPublicWatchlist(req.supabase, String(req.params.userId), {
    status: req.query.status as string | undefined,
    mediaType: req.query.mediaType as string | undefined,
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 20,
  });

  res.json({ data });
});
