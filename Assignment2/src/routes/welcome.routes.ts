import express, { Router } from 'express';
import { welcome } from '../controllers/index.controller';

const router: Router = express.Router();

router.get('/', welcome);

export default router;