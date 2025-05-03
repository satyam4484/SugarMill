import { Router } from 'express';
import { LabourerController } from '../controllers/labour.controller.js';
import { uploadFiles } from '../middleware/fileupload.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
const router = Router();

router.use(authenticateToken);
router.route('/').post(uploadFiles(3),LabourerController.create);
router.get('/:id', LabourerController.getById);
router.get('/', LabourerController.getAll);
router.route('/:id').put(uploadFiles(3), LabourerController.update);
router.delete('/:id', LabourerController.delete);

export default router;