import { Router } from 'express';
import { getAllCategories } from '../controllers/categories.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, getAllCategories);

export default router;