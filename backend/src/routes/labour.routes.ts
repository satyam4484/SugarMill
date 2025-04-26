import { Router } from 'express';
import { LabourerController } from '../controllers/labour.controller.js';

const router = Router();

router.post('/', LabourerController.create);
router.get('/:id', LabourerController.getById);
router.get('/', LabourerController.getAll);
router.put('/:id', LabourerController.update);
router.delete('/:id', LabourerController.delete);

export default router;