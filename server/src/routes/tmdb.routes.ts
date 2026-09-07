import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { tmdbLimiter } from '../middleware/rateLimit.js';
import * as tmdbController from '../controllers/tmdb.controller.js';

const router = Router();

router.use(requireAuth, tmdbLimiter);

router.get('/search', tmdbController.search);
router.get('/movie/:tmdbId', tmdbController.getMovie);
router.get('/tv/:tmdbId', tmdbController.getTv);
router.get('/tv/:tmdbId/season/:seasonNum', tmdbController.getTvSeason);
router.get('/trending', tmdbController.getTrending);

export default router;
