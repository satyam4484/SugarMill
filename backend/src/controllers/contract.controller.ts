import { Request, Response } from 'express';
import * as ContractRepository from '../repositories/contract.repository.js';
import logger from '../utils/logger.js';

export class ContractController {
    static async create(req: Request, res: Response): Promise<Response> {
        try {
            const contractData = req.body;
            const response = await ContractRepository.createContract(contractData);
            if (response.isError) {
                return res.status(400).json(response);
            }
            return res.status(201).json(response);
        } catch (error) {
            logger.error('Error creating contract:', error);
            return res.status(500).json({ message: 'Failed to create contract' });
        }
    }

    static async getById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const response = await ContractRepository.getContractById(id);
            if (response.isError) {
                return res.status(404).json(response);
            }
            return res.status(200).json(response);
        } catch (error) {
            logger.error('Error fetching contract by ID:', error);
            return res.status(500).json({ message: 'Error fetching contract' });
        }
    }

    static async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const query = req.query;
            const response = await ContractRepository.getAllContracts(query);
            if (response.isError) {
                return res.status(400).json(response);
            }
            return res.status(200).json(response);
        } catch (error) {
            logger.error('Error fetching all contracts:', error);
            return res.status(500).json({ message: 'Error fetching contracts' });
        }
    }

    static async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const response = await ContractRepository.updateContract(id, updateData);
            if (response.isError) {
                return res.status(404).json(response);
            }
            return res.status(200).json(response);
        } catch (error) {
            logger.error('Error updating contract:', error);
            return res.status(500).json({ message: 'Error updating contract' });
        }
    }

    static async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const response = await ContractRepository.deleteContract(id);
            if (response.isError) {
                return res.status(404).json(response);
            }
            return res.status(200).json(response);
        } catch (error) {
            logger.error('Error deleting contract:', error);
            return res.status(500).json({ message: 'Error deleting contract' });
        }
    }
}