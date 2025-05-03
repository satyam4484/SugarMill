import { Request, Response } from 'express';
import * as ContractRepository from '../repositories/contract.repository.js';
import logger from '../utils/logger.js';

export class ContractController {
    static async create(req: Request, res: Response): Promise<Response> {
        try {
            const contractData = req.body;
            const files = req.files as Express.Multer.File[];
            if (!files || files.length === 0) {
                return res.status(400).json({ message: 'No files uploaded' });
            }
            contractData.agreement = (files[0] as any).fullPath;
            contractData.labourers = JSON.parse(contractData.labourers)
            contractData.Guarantor = JSON.parse(contractData.Guarantor)
            contractData.millOwner = (req as any).mill._id;
            console.log("final format of data---",contractData)
            const response = await ContractRepository.createContract(contractData);
            if (response.isError) {
                return res.status(400).json(response);
            }
            return res.status(201).json({});
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

    static async getAll(req: any, res: Response): Promise<Response> {
        try {
            const query = req.query;
            let filter: any = {}
            if(req?.mill) {
                filter.millOwner = req.mill._id;
            }else if (req?.contractor) {
                filter.contractor = req.contractor._id
            }
            if(query?.status) {
                filter.status=query.status
            }
            console.log("filter",filter)
            const response = await ContractRepository.getAllContracts(filter,query);
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

    static async findAvailableLabourers(req: Request, res: Response): Promise<Response> {
        try {
            const { contractorId } = req.params;
            const { startDate, endDate } = req.query;
    
            if (!contractorId || !startDate || !endDate) {
                return res.status(400).json({
                    isError: true,
                    message: 'ContractorId, startDate, and endDate are required'
                });
            }
    
            const response = await ContractRepository.findAvailableLabourers(
                contractorId,
                new Date(startDate as string),
                new Date(endDate as string)
            );
    
            if (response.isError) {
                return res.status(400).json(response);
            }
            return res.status(200).json(response);
        } catch (error) {
            logger.error('Error finding available labourers:', error);
            return res.status(500).json({ message: 'Error finding available labourers' });
        }
    }
}