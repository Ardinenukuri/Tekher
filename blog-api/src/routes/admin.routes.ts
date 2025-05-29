import express from 'express';
import {
  getAllUsers,
  getAllPosts,
  deleteUser,
  deletePost
} from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';

const router = express.Router();

// Fix: wrap async middleware to catch errors properly
const asyncHandler = (fn: express.RequestHandler): express.RequestHandler =>
  (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// All routes require authentication and admin role
router.use(asyncHandler(authenticate), asyncHandler(requireAdmin));

router.get('/users', getAllUsers);
router.get('/posts', getAllPosts);
router.delete('/users/:userId', deleteUser);
router.delete('/posts/:postId', deletePost);

export default router;
