import { Router } from 'express';
import { promoteToAdmin, requireAdmin } from '../middlewares/role.middleware';
import { getAllUsers } from '../controllers/admin.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/users', requireAdmin, asyncHandler(getAllUsers));
router.post(
  '/promote', 
  requireAdmin, 
  asyncHandler(promoteToAdmin)
);

export default router;