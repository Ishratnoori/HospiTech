import { Router } from 'express';
import { getUserActivity, createActivity } from '../controllers/activity.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Protected routes
router.use(verifyJWT);

router.get('/', getUserActivity);
router.post('/', createActivity);

export default router; 