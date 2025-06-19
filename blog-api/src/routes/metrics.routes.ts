import { Router } from 'express';
import { getDashboardMetrics } from '../controllers/metrics.controller';
import { authenticate } from '../middlewares/auth.middleware'; 
import { requireAdmin } from '../middlewares/admin.middleware';

const router = Router();

router.get('/metrics', authenticate, requireAdmin, getDashboardMetrics);

export default router;