import { Router } from 'express';
import { register, login, getProfile, resetPassword, requestPasswordReset, verifyEmail } from '../controllers/auth.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middlewares/auth.middleware';


const router = Router();

router.post('/register', register);
router.post('/verify-email', asyncHandler(verifyEmail));
router.post('/login', login);
router.get('/', authenticate, asyncHandler(getProfile));
router.post('/forgot-password', asyncHandler(requestPasswordReset));
router.post('/reset-password', asyncHandler(resetPassword));
export default router;