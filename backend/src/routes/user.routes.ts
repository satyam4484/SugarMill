import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/validate', UserController.checkExistingUser);
router.post('/generate-password', UserController.generateNewPassword);

export default router;