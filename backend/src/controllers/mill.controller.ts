import { Request, Response } from 'express';
import logger from '../utils/logger.js';
import { createMill, getMillById, updateMill, deleteMill , getAllMills} from '../repositories/mill.repository.js';

export class MillController {
    async createMill(req: Request, res: Response): Promise<Response> {
        try {
            const millData = req.body;
            const mill = await createMill(millData);
            return res.status(201).json(mill);
        } catch (error) {
            logger.error('Error creating mill:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async getAllMills(req: Request, res: Response): Promise<Response> {
        try {
            const mills = await getAllMills();
            return res.status(200).json(mills);
        } catch (error) {
            logger.error('Error fetching mills:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async getMillById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const mill = await getMillById(id);

            if (!mill) {
                return res.status(404).json({ message: 'Mill not found' });
            }

            return res.status(200).json(mill);
        } catch (error) {
            logger.error('Error fetching mill:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async updateMill(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const mill = await updateMill(id, updateData);

            if (!mill) {
                return res.status(404).json({ message: 'Mill not found for update' });
            }

            return res.status(200).json(mill);
        } catch (error) {
            logger.error('Error updating mill:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async deleteMill(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const success = await deleteMill(id);

            if (!success) {
                return res.status(404).json({ message: 'Mill not found for deletion' });
            }

            return res.status(200).json({ message: 'Mill deleted successfully' });
        } catch (error) {
            logger.error('Error deleting mill:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export const millController = new MillController();