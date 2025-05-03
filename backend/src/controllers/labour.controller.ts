import { Request, Response } from 'express';
import * as LabourRepository from '../repositories/labour.repository.js';
import logger from '../utils/logger.js';

export class LabourerController {
    static async create(req: any, res: Response): Promise<Response> {
        try {
            const LabourerData = req.body;
            console.log("labourere data--",LabourerData)
            const files = req.files as Express.Multer.File[];
            if (!files || files.length === 0) {
                return res.status(400).json({ message: 'No files uploaded' });
            }else if(files.length < 3) {
                return res.status(400).json({message:'Please Upload all valid images'});
            }
            LabourerData.profilePicture = files[0].path;
            LabourerData.documents.aadhar.aadharPhoto = files[1].path;
            LabourerData.documents.pancard.panPhoto = files[2].path;
            LabourerData.contractor = req?.contractor._id;
            const labourer = await LabourRepository.createLabour(LabourerData);
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

    static async getAll(req: any, res: Response): Promise<Response> {
        try {
            logger.info('Fetching all Labourerss...');
            const query = req.query;
            let filter = {}
            if(req?.contractor) {
                filter = {contractor: req.contractor}
            }
            
            const contractors = await LabourRepository.getAllLabourers(filter,query);
            return res.status(200).json(contractors);
        } catch (error) {
            logger.error('Error fetching all Labourerss:', error);
            return res.status(500).json({ message: 'Error fetching Labourerss' });
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