import { Router } from 'express';
import { 
  getAllUsers, 
  deleteUser, 
  getAllPosts,
  deletePost,
  updateUserRole,
  updatePost,
  
} from '../controllers/admin.controller'; 
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeSuperAdmin } from '../middlewares/superadmin.middleware'; 
import { getDashboardMetrics } from '../controllers/metrics.controller'

import { asyncHandler } from '../utils/asyncHandler';
import { updatePostDetails } from '../controllers/superadmin.controller';

const router = Router();

router.get('/metrics', authenticate, authorizeSuperAdmin, getDashboardMetrics);
router.get('/posts', authenticate, authorizeSuperAdmin, getAllPosts);
router.delete('/posts/:postId', authenticate, authorizeSuperAdmin, deletePost);
router.get('/users', authenticate, authorizeSuperAdmin, getAllUsers);
router.delete('/users/:userId', authenticate, authorizeSuperAdmin, deleteUser);
router.put('/users/:userId/role', authenticate, authorizeSuperAdmin, updateUserRole);
router.put(
  '/update/posts/:postId',
  authenticate, 
  authorizeSuperAdmin,
  updatePostDetails 
);

export default router;