import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import * as episodesService from '../services/episodes.service.js';

export const getEpisodeProgress = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  const data = await episodesService.getEpisodeProgress(req.supabase, String(req.params.entryId));
  res.json({ data });
});

export const toggleEpisode = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  const data = await episodesService.toggleEpisode(
    req.supabase,
    req.user.id,
    String(req.params.entryId),
    Number(req.params.seasonNum),
    Number(req.params.episodeNum),
    req.body.watched,
  );
  res.json({ data });
});

export const markSeasonComplete = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  await episodesService.markSeasonComplete(
    req.supabase,
    req.user.id,
    String(req.params.entryId),
    Number(req.params.seasonNum),
    req.body.total_episodes,
  );
  res.json({ data: { success: true } });
});

export const unmarkSeason = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.supabase) throw new AppError('Unauthorized', 401);

  await episodesService.unmarkSeason(
    req.supabase,
    req.user.id,
    String(req.params.entryId),
    Number(req.params.seasonNum),
  );
  res.json({ data: { success: true } });
});
