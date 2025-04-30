import { Router } from 'express';
import { LabourerController } from '../controllers/labour.controller.js';
import { uploadFiles } from '../middleware/fileupload.middleware.js';
const router = Router();

router.route('/').post(uploadFiles(3),LabourerController.create);
router.get('/:id', LabourerController.getById);
router.get('/', LabourerController.getAll);
router.put('/:id', LabourerController.update);
router.delete('/:id', LabourerController.delete);

export default router;