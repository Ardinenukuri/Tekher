import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import * as postsController from '../controllers/posts.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', authenticate, asyncHandler(postsController.createPost));
router.get('/', asyncHandler(postsController.getAllPosts));
router.get('/:id', asyncHandler(postsController.getPostById));
router.put('/:id', authenticate, asyncHandler(postsController.updatePost));
router.delete('/:id', authenticate, asyncHandler(postsController.deletePost));

export default router;