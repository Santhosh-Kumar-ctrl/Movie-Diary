import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as tmdbService from '../services/tmdb.service.js';

export const search = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query.query as string;
  const type = (req.query.type as string) || 'multi';
  const page = Number(req.query.page) || 1;
  const data = await tmdbService.searchTmdb({ query, type: type as 'movie' | 'tv' | 'multi', page });
  res.json({ data });
});

export const getMovie = asyncHandler(async (req: Request, res: Response) => {
  const tmdbId = Number(req.params.tmdbId);
  const data = await tmdbService.getMovieDetails(tmdbId);
  res.json({ data });
});

export const getTv = asyncHandler(async (req: Request, res: Response) => {
  const tmdbId = Number(req.params.tmdbId);
  const data = await tmdbService.getTvDetails(tmdbId);
  res.json({ data });
});

export const getTvSeason = asyncHandler(async (req: Request, res: Response) => {
  const tmdbId = Number(req.params.tmdbId);
  const seasonNum = Number(req.params.seasonNum);
  const data = await tmdbService.getTvSeason(tmdbId, seasonNum);
  res.json({ data });
});

export const getTrending = asyncHandler(async (req: Request, res: Response) => {
  const type = (req.query.type as string) || 'all';
  const window = (req.query.window as string) || 'week';
  const data = await tmdbService.getTrending(type as 'movie' | 'tv' | 'all', window as 'day' | 'week');
  res.json({ data });
});
