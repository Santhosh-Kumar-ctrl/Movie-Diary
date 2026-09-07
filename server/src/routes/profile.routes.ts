import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';
import * as profileController from '../controllers/profile.controller.js';

const router = Router();

const updateProfileSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  display_name: z.string().max(50).nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
  is_public: z.boolean().optional(),
});

router.get('/', requireAuth, profileController.getMyProfile);
router.patch('/', requireAuth, validate({ body: updateProfileSchema }), profileController.updateMyProfile);
router.get('/search', requireAuth, profileController.searchUsers);

export default router;
