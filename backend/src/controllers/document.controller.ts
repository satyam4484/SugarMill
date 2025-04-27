import { Request, Response } from 'express';
import * as DocumentRepository from '../repositories/document.repository.js';
import logger from '../utils/logger.js';

export class DocumentController {
    static async checkExistingDocuments(req: Request, res: Response): Promise<Response> {
        try {
            const { aadharNumber, panNumber } = req.body;
            const result = await DocumentRepository.checkExistingDocuments(aadharNumber, panNumber);
            
            if (result.isError) {
                return res.status(200).json({
                    success: false,
                    message: result.message
                });
            }

            return res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            logger.error('Error checking existing documents:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error while checking documents'
            });
        }
    }

    static async createDocument(req: Request, res: Response): Promise<Response> {
        try {
            const documentData = req.body;
            const result = await DocumentRepository.createDocuments(documentData);

            if (result.isError) {
                return res.status(400).json({
                    success: false,
                    message: result.message
                });
            }

            return res.status(201).json({
                success: true,
                message: 'Document created successfully',
                data: result.data
            });
        } catch (error) {
            logger.error('Error creating document:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error while creating document'
            });
        }
    }
}