import express from 'express';
import { ContractController } from '../controllers/contract.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Create a new contract
router.post('/', ContractController.create);

// Get all contracts
router.get('/', ContractController.getAll);

// Get contract by ID
router.get('/:id', ContractController.getById);

// Update contract by ID
router.put('/:id', ContractController.update);

// Delete contract by ID
router.delete('/:id', ContractController.delete);

export default router;