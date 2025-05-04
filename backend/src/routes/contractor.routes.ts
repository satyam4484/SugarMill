import { Router } from 'express';
import { ContractorController } from '../controllers/contractor.controller.js';
import { uploadFiles } from '../middleware/fileupload.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
const router = Router();

router.route('/').post(authenticateToken, uploadFiles(2), ContractorController.create);
router.route('/dashboard-stats').get(authenticateToken, ContractorController.getDashboardStats);
router.get('/:id', ContractorController.getById);
router.route('/').get(authenticateToken, ContractorController.getAll);
router.put('/:id', ContractorController.update);
router.delete('/:id', ContractorController.delete);

export default router;
