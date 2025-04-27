import Documents, { IDocument } from "../models/documents.model.js";
import logger from "../utils/logger.js";

export const checkExistingDocuments = async (aadharNumber?: string, panNumber?: string): Promise<any> => {
    const response: any = {
        isError: false,
        message: 'Documents are unique',
        data: null
    };
    
    try {
        if (aadharNumber) {
            const existingAadhar = await Documents.findOne({ 'aadhar.aadharNumber': aadharNumber });
            if (existingAadhar) {
                response.isError = true;
                response.message = 'Aadhar number already exists';
                return response;
            }
        }

        if (panNumber) {
            const existingPan = await Documents.findOne({ 'pancard.panNumber': panNumber });
            if (existingPan) {
                response.isError = true;
                response.message = 'PAN number already exists';
                return response;
            }
        }

        return response;
    } catch (error) {
        logger.error('Error checking existing documents:', error);
        response.isError = true;
        response.message = 'Error checking existing documents';
        response.data = error;
        return response;
    }
};

export const createDocuments = async (documentsData: Partial<IDocument>): Promise<any> => {
    const response: any = {
        isError: false,
        message: 'Document created successfully',
        data: null
    };
    
    try {
        // Check for existing documents first
        const existingDocsCheck = await checkExistingDocuments(
            documentsData.aadhar?.aadharNumber,
            documentsData.pancard?.panNumber
        );

        if (existingDocsCheck.isError) {
            return existingDocsCheck;
        }

        logger.info('Creating document');
        const documents = new Documents(documentsData);
        await documents.save();
        response.data = documents;
        return response;
    } catch (error) {
        logger.error('Error creating document', error);
        response.isError = true;
        response.message = 'Error creating document';
        response.data = error;
        return response;
    }
};

export const getDocumentByAadhar = async (aadharNumber: string): Promise<IDocument | null> => {
    try {
        return await Documents.findOne({ 'aadhar.aadharNumber': aadharNumber });
    } catch (error) {
        logger.error('Error fetching document by Aadhar:', error);
        throw new Error('Error fetching document by Aadhar');
    }
};

export const getDocumentByPan = async (panNumber: string): Promise<IDocument | null> => {
    try {
        return await Documents.findOne({ 'pancard.panNumber': panNumber });
    } catch (error) {
        logger.error('Error fetching document by PAN:', error);
        throw new Error('Error fetching document by PAN');
    }
};
