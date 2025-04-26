import { Router } from 'express';
import {millController} from '../controllers/mill.controller.js';

const router = Router();

// Define your routes here
router.get('/', millController.getAllMills);
router.get('/:id', millController.getMillById);
router.post('/', millController.createMill);
router.put('/:id', millController.updateMill);
router.delete('/:id', millController.deleteMill);

export default router;