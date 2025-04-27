import express from 'express';
import { ContractController } from '../controllers/contract.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a new contract
router.post('/', authenticateToken, ContractController.createContract);

// Get all contracts
router.get('/', authenticateToken, ContractController.getContracts);

// Get a specific contract by ID
router.get('/:id', authenticateToken, ContractController.getContractById);

// Update a contract
router.put('/:id', authenticateToken, ContractController.updateContract);

// Delete a contract
router.delete('/:id', authenticateToken, ContractController.deleteContract);

export default router;