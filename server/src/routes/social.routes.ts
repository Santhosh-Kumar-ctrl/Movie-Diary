import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as socialController from '../controllers/social.controller.js';

const router = Router();

router.post('/follow/:userId', requireAuth, socialController.follow);
router.delete('/follow/:userId', requireAuth, socialController.unfollow);
router.get('/followers', requireAuth, socialController.getFollowers);
router.get('/following', requireAuth, socialController.getFollowing);
router.get('/is-following/:userId', requireAuth, socialController.checkIsFollowing);
router.get('/feed', requireAuth, socialController.getFeed);

export default router;
