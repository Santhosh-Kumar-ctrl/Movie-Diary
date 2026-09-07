import { Router } from 'express';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';
import * as watchlistController from '../controllers/watchlist.controller.js';

const router = Router();

const addEntrySchema = z.object({
  tmdb_id: z.number().int().positive(),
  media_type: z.enum(['movie', 'tv']),
  status: z.enum(['planning', 'watching', 'watched', 'dropped']).default('planning'),
  title: z.string().min(1),
  poster_path: z.string().nullable().optional(),
  overview: z.string().nullable().optional(),
  release_year: z.number().int().nullable().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['planning', 'watching', 'watched', 'dropped']),
});

router.get('/', requireAuth, watchlistController.getWatchlist);
router.get('/:id', requireAuth, watchlistController.getEntryById);
router.post('/', requireAuth, validate({ body: addEntrySchema }), watchlistController.addToWatchlist);
router.patch('/:id', requireAuth, validate({ body: updateStatusSchema }), watchlistController.updateWatchlistStatus);
router.delete('/:id', requireAuth, watchlistController.removeFromWatchlist);
router.get('/check/:mediaType/:tmdbId', requireAuth, watchlistController.checkWatchlistEntry);

export default router;
