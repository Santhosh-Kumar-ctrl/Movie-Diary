import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';
import * as reviewsController from '../controllers/reviews.controller.js';

const router = Router();

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(10),
  review_text: z.string().max(2000).nullable().optional(),
  contains_spoilers: z.boolean().optional().default(false),
});

const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(10).optional(),
  review_text: z.string().max(2000).nullable().optional(),
  contains_spoilers: z.boolean().optional(),
});

router.get('/entry/:entryId', requireAuth, reviewsController.getMyReview);
router.post('/entry/:entryId', requireAuth, validate({ body: createReviewSchema }), reviewsController.createReview);
router.patch('/:id', requireAuth, validate({ body: updateReviewSchema }), reviewsController.updateReview);
router.delete('/:id', requireAuth, reviewsController.deleteReview);

export default router;
