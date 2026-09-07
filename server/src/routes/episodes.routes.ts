import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';
import * as episodesController from '../controllers/episodes.controller.js';

const router = Router();

const toggleSchema = z.object({
  watched: z.boolean(),
});

const markSeasonSchema = z.object({
  total_episodes: z.number().int().positive(),
});

router.get('/:entryId/episodes', requireAuth, episodesController.getEpisodeProgress);
router.put(
  '/:entryId/episodes/:seasonNum/:episodeNum',
  requireAuth,
  validate({ body: toggleSchema }),
  episodesController.toggleEpisode,
);
router.put(
  '/:entryId/seasons/:seasonNum/complete',
  requireAuth,
  validate({ body: markSeasonSchema }),
  episodesController.markSeasonComplete,
);
router.delete(
  '/:entryId/seasons/:seasonNum',
  requireAuth,
  episodesController.unmarkSeason,
);

export default router;
