import { Request, Response } from 'express';
import * as ContractorRepository from '../repositories/contractor.repository.js';
import logger from '../utils/logger.js';

export class ContractorController {
    static async create(req: Request, res: Response): Promise<Response> {
        try {
            const contractorData = req.body;
            const files = req.files as Express.Multer.File[];
            if (!files || files.length === 0) {
                return res.status(400).json({ message: 'No files uploaded' });
            }
            const filePaths = files.map(file => file.path);
            contractorData.documents.aadhar.aadharPhoto = filePaths[0];
            contractorData.documents.pancard.panPhoto = filePaths[1];
            const contractor = await ContractorRepository.createContractor(contractorData);
            return res.status(201).json(contractor);
        } catch (error) {
            logger.error('Error creating contractor:', error);
            return res.status(500).json({ message: 'Failed to create contractor' });
        }
    }


    static async getById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const contractor = await ContractorRepository.getContractorById(id);
            if (!contractor) {
                return res.status(404).json({ message: 'Contractor not found' });
            }
            return res.status(200).json(contractor);
        } catch (error) {
            logger.error('Error fetching contractor by ID:', error);
            return res.status(500).json({ message: 'Error fetching contractor' });
        }
    }

    static async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const query = req.query;
            const contractors = await ContractorRepository.getAllContractors(query);
            return res.status(200).json(contractors);
        } catch (error) {
            logger.error('Error fetching all contractors:', error);
            return res.status(500).json({ message: 'Error fetching contractors' });
        }
    }

    static async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const contractor = await ContractorRepository.updateContractor(id, updateData);
            if (!contractor) {
                return res.status(404).json({ message: 'Contractor not found' });
            }
            return res.status(200).json(contractor);
        } catch (error) {
            logger.error('Error updating contractor:', error);
            return res.status(500).json({ message: 'Error updating contractor' });
        }
    }

    static async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const success = await ContractorRepository.deleteContractor(id);
            if (!success) {
                return res.status(404).json({ message: 'Contractor not found' });
            }
            return res.status(200).json({ message: 'Contractor deleted successfully' });
        } catch (error) {
            logger.error('Error deleting contractor:', error);
            return res.status(500).json({ message: 'Error deleting contractor' });
        }
    }

    static async getDashboardStats(req: any, res: Response): Promise<Response> {
        try {
            const stats = await ContractorRepository.getContractorDashboardStats(req.contractor._id);
            return res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            logger.error('Error in getDashboardStats:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to get dashboard statistics'
            });
        }
    }
}