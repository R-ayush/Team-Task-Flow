import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { getDashboard } from '../controllers/dashboardController.js';

const router = Router();

// GET /api/dashboard – aggregate stats for the logged-in user
router.get('/', authenticate, getDashboard);

export default router;
