import Contractor, { IContractor } from '../models/contractor.model.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';
import { generateUniqueUserId, generateSecurePassword } from './user.repository.js';
import { createUser } from './auth.repository.js';
import User ,{ IUser } from '../models/user.model.js'
import { createDocuments } from './document.repository.js';
import Documents from '../models/documents.model.js';

// Create a new contractor
export const createContractor = async (contractorData: any): Promise<{userId: string, password: string}> => {
    let createdUser = null;
    let createdDocument = null;
    try {
        logger.info('Creating a new contractor record');
        const { name, email, role } = contractorData as any;
        logger.info('Generating new UserId based on the details provided');
        const userId = await generateUniqueUserId(name, email, role);

        // write function to generate password for user
        const password = generateSecurePassword(name, role);

        logger.info('User id and password generate generaed successfully  ', userId);

        // Create new user
        createdUser = await createUser({
            userId,
            email,
            passwordHash: password,
            name,
            contactNo: contractorData.contactNo,
            role: role
        });
        console.log("created user", createdUser);

        console.log("creating document object for contractor");
        const documentResponse: any  = await  createDocuments(contractorData.documents);
        if(documentResponse.isError) {
            logger.error('Error creating documents for contractor:', documentResponse.message);
            throw new Error('Failed to create contractor');
        }
        createdDocument = documentResponse.data;
        const contractor = new Contractor({
            user: createdUser._id,
            documents: documentResponse.data,
            companyName: contractorData.companyName,
            location: contractorData.location,
            address: contractorData.address,
            companyRegisterationNo: contractorData.companyRegisterationNo,
            GST_NO: contractorData.GST_NO,
            ownerName: contractorData.ownerName,
            ownerContactNo: contractorData.ownerContactNo,
            Guarantor:contractorData.Guarantor
        });
        await contractor.save();
        logger.success(`Contractor created successfully with ID: ${contractor._id}`);
        return {userId, password};
    } catch (error) {
        logger.error('Error creating contractor:', error);
        // If user was created but contractor creation failed, delete the user
        if (createdDocument) {
            try {
                await Documents.findByIdAndDelete(createdDocument);
                logger.info(`Cleaned up documents ${createdDocument} after contractor creation failure`);
            } catch (cleanupError) {
                logger.error('Error cleaning up documents after contractor creation failure:', cleanupError);
            }
        }
        if (createdUser) {
            try {
                await User.findByIdAndDelete(createdUser._id);
                logger.info(`Cleaned up user ${createdUser._id} after contractor creation failure`);
            } catch (cleanupError) {
                logger.error('Error cleaning up user after contractor creation failure:', cleanupError);
            }
        }
        throw new Error('Failed to create contractor');
    }
};

// Get contractor by ID
export const getContractorById = async (id: string): Promise<IContractor | null> => {
    try {
        logger.info(`Fetching contractor with ID: ${id}`);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn(`Invalid contractor ID format: ${id}`);
            return null;
        }
        const contractor = await Contractor.findById(id).populate('user').populate('documents');
        if (contractor) {
            logger.info(`Successfully fetched contractor with ID: ${id}`);
        } else {
            logger.warn(`Contractor with ID: ${id} not found`);
        }
        return contractor;
    } catch (error) {
        logger.error(`Error fetching contractor with ID: ${id}`, error);
        throw new Error('Error fetching contractor by ID');
    }
};

// Get all contractors
export const getAllContractors = async (query?:any): Promise<IContractor[]> => {
    try {
        logger.info('Fetching all contractors');
        const contractors = await Contractor.find().select('-experience -specialization -updatedAt -createdAt').populate([
            {
                path: 'user',
                select:'-passwordHash -updatedAt '
            },
            {
                path: 'documents',
                select:'aadhar.aadharNumber pancard.panNumber'
            }
        ]).limit(query?.limit);
        logger.info(`Successfully fetched ${contractors.length} contractors`);
        return contractors;
    } catch (error) {
        logger.error('Error fetching all contractors:', error);
        throw new Error('Error fetching all contractors');
    }
};

// Update contractor by ID
export const updateContractor = async (id: string, updateData: Partial<IContractor>): Promise<IContractor | null> => {
    try {
        logger.info(`Updating contractor with ID: ${id}`);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn(`Invalid contractor ID format for update: ${id}`);
            return null;
        }
        const contractor = await Contractor.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('user').populate('documents');
        if (contractor) {
            logger.success(`Contractor updated successfully: ${id}`);
        } else {
            logger.warn(`Contractor with ID: ${id} not found for update`);
        }
        return contractor;
    } catch (error) {
        logger.error(`Error updating contractor with ID: ${id}`, error);
        throw new Error('Error updating contractor');
    }
};

// Delete contractor by ID
export const deleteContractor = async (id: string): Promise<boolean> => {
    try {
        logger.info(`Deleting contractor with ID: ${id}`);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn(`Invalid contractor ID format for delete: ${id}`);
            return false;
        }
        const result = await Contractor.findByIdAndDelete(id);
        if (result) {
            logger.success(`Contractor deleted successfully: ${id}`);
            return true;
        } else {
            logger.warn(`Contractor with ID: ${id} not found for deletion`);
            return false;
        }
    } catch (error) {
        logger.error(`Error deleting contractor with ID: ${id}`, error);
        throw new Error('Error deleting contractor');
    }
};