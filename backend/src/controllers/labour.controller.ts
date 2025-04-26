import { Request, Response } from 'express';
import * as LabourRepository from '../repositories/labour.repository.js';
import logger from '../utils/logger.js';

export class LabourerController {
    static async create(req: Request, res: Response): Promise<Response> {
        try {
            const contractorData = req.body;
            const labourer = await LabourRepository.createLabour(contractorData);
            return res.status(201).json(labourer);
        } catch (error) {
            logger.error('Error creating labourer:', error);
            return res.status(500).json({ message: 'Failed to create labourer' });
        }
    }

    static async getById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const labourer = await LabourRepository.getLabourerById(id);
            if (!labourer) {
                return res.status(404).json({ message: 'labourer not found' });
            }
            return res.status(200).json(labourer);
        } catch (error) {
            logger.error('Error fetching labourer by ID:', error);
            return res.status(500).json({ message: 'Error fetching labourer' });
        }
    }

    static async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const contractors = await LabourRepository.getAllLabourers();
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
            const labourer = await LabourRepository.updateLabourer(id, updateData);
            if (!labourer) {
                return res.status(404).json({ message: 'labourer not found' });
            }
            return res.status(200).json(labourer);
        } catch (error) {
            logger.error('Error updating labourer:', error);
            return res.status(500).json({ message: 'Error updating labourer' });
        }
    }

    static async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const success = await LabourRepository.deleteLabourer(id);
            if (!success) {
                return res.status(404).json({ message: 'labourer not found' });
            }
            return res.status(200).json({ message: 'labourer deleted successfully' });
        } catch (error) {
            logger.error('Error deleting labourer:', error);
            return res.status(500).json({ message: 'Error deleting labourer' });
        }
    }
}