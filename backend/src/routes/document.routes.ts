import { Router } from 'express';
import { DocumentController } from '../controllers/document.controller.js';

const router = Router();

router.post('/validate',DocumentController.checkExistingDocuments);

export default router;