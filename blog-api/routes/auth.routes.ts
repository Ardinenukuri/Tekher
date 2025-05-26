import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middlewares/auth.middleware';


const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', authenticate, asyncHandler(getProfile));
export default router;