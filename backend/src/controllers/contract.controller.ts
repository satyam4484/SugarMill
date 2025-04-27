import { Request, Response } from 'express';
import * as ContractRepository from '../repositories/contract.repository.js';
import logger from '../utils/logger.js';

export class ContractController {
    static async createContract(req: Request, res: Response): Promise<Response> {
        try {
            const contractData = req.body;
            const response = await ContractRepository.createContract(contractData);
            if (response.isError) {
                logger.error(response.message);
                return res.status(400).json({ success: false, message: response.message });
            }
            return res.status(201).json({ success: true, message: response.message, data: response.data });
        } catch (error) {
            logger.error('Unexpected error creating contract:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }

    static async getContracts(req: Request, res: Response): Promise<Response> {
        try {
            const filter = {}; // Define any filter criteria if needed
            const response = await ContractRepository.getAllContracts(filter);
            if (response.isError) {
                logger.error(response.message);
                return res.status(500).json({ success: false, message: response.message });
            }
            return res.status(200).json({ success: true, data: response.data });
        } catch (error) {
            logger.error('Unexpected error fetching contracts:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }

    static async getContractById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const response = await ContractRepository.getContractById(id);
            if (response.isError) {
                logger.error(response.message);
                return res.status(404).json({ success: false, message: response.message });
            }
            return res.status(200).json({ success: true, data: response.data });
        } catch (error) {
            logger.error('Unexpected error fetching contract:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }

    static async updateContract(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const response = await ContractRepository.updateContract(id, updateData);
            if (response.isError) {
                logger.error(response.message);
                return res.status(404).json({ success: false, message: response.message });
            }
            return res.status(200).json({ success: true, message: response.message, data: response.data });
        } catch (error) {
            logger.error('Unexpected error updating contract:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }

    static async deleteContract(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const response = await ContractRepository.deleteContract(id);
            if (response.isError) {
                logger.error(response.message);
                return res.status(404).json({ success: false, message: response.message });
            }
            return res.status(200).json({ success: true, message: response.message });
        } catch (error) {
            logger.error('Unexpected error deleting contract:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
}