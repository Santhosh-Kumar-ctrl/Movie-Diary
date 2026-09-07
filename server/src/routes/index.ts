import { Router } from 'express';
import authRoutes from './auth.routes.js';
import tmdbRoutes from './tmdb.routes.js';
import watchlistRoutes from './watchlist.routes.js';
import reviewsRoutes from './reviews.routes.js';
import episodesRoutes from './episodes.routes.js';
import socialRoutes from './social.routes.js';
import profileRoutes from './profile.routes.js';
import { optionalAuth } from '../middleware/auth.js';
import { getPublicWatchlist } from '../controllers/watchlist.controller.js';
import { getReviewsForTitle, getUserReviews } from '../controllers/reviews.controller.js';
import { getPublicProfile } from '../controllers/profile.controller.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tmdb', tmdbRoutes);
router.use('/watchlist', watchlistRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/watchlist', episodesRoutes);
router.use('/social', socialRoutes);
router.use('/profile', profileRoutes);

router.get('/users/:userId', optionalAuth, getPublicProfile);
router.get('/users/:userId/watchlist', optionalAuth, getPublicWatchlist);
router.get('/users/:userId/reviews', optionalAuth, getUserReviews);
router.get('/tmdb/:mediaType/:tmdbId/reviews', optionalAuth, getReviewsForTitle);

export default router;
