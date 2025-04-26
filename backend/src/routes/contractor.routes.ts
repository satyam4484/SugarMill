import { Router } from 'express';
import { ContractorController } from '../controllers/contractor.controller.js';

const router = Router();

router.post('/', ContractorController.create);
router.get('/:id', ContractorController.getById);
router.get('/', ContractorController.getAll);
router.put('/:id', ContractorController.update);
router.delete('/:id', ContractorController.delete);

export default router;