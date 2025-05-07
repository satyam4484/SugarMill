import Labourer, { ILabourer } from '../models/labour.model.js';
import { createUser } from '../repositories/auth.repository.js';
import { createDocuments } from './document.repository.js';
import { generateUniqueUserId, generateSecurePassword } from './user.repository.js';
import Documents from '../models/documents.model.js';
import User from '../models/user.model.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';
import Contractor from '../models/contractor.model.js'

// Create a new labourer
export const createLabour = async (labourData: any): Promise<{userId: string, password: string}> => {
    let createdUser = null;
    let createdDocument = null;
    try {
        logger.info('Creating a new labourer record');
        const { name, email, role, contractor } = labourData;
        logger.info('Generating new UserId based on the details provided');
        const userId = await generateUniqueUserId(name, email, role);

        // Generate password for user
        const password = generateSecurePassword(name, role);

        logger.info('User id and password generated successfully', userId);

        // Create new user
        createdUser = await createUser({
            userId,
            email,
            passwordHash: password,
            name,
            contactNo: labourData.contactNo,
            role: role
        });

        const documentResponse: any = await createDocuments(labourData.documents);
        if(documentResponse.isError) {
            logger.error('Error creating documents for labourer:', documentResponse.message);
            throw new Error('Failed to create labourer');
        }
        createdDocument = documentResponse.data;
        const labourer = new Labourer({
            user: createdUser._id,
            documents: documentResponse.data,
            contractor: contractor,
            Age: labourData.Age,
            Gender: labourData.Gender,
            profilePicture: labourData.profilePicture
        });
        await labourer.save();
        logger.success(`Labourer created successfully with ID: ${labourer._id}`);
        await Contractor.findByIdAndUpdate(
            contractor,
            { $inc: { laboursCount: 1 } },
            { new: true }
        );
        return {userId, password};
    } catch (error) {
        logger.error('Error creating labourer:', error);
        // If document was created but labourer creation failed, delete the document
        if (createdDocument) {
            try {
                await Documents.findByIdAndDelete(createdDocument);
                logger.info(`Cleaned up documents ${createdDocument} after labourer creation failure`);
            } catch (cleanupError) {
                logger.error('Error cleaning up documents after labourer creation failure:', cleanupError);
            }
        }
        // If user was created but labourer creation failed, delete the user
        if (createdUser) {
            try {
                await User.findByIdAndDelete(createdUser._id);
                logger.info(`Cleaned up user ${createdUser._id} after labourer creation failure`);
            } catch (cleanupError) {
                logger.error('Error cleaning up user after labourer creation failure:', cleanupError);
            }
        }
        throw new Error('Failed to create labourer');
    }
};

// Get labourer by ID
export const getLabourerById = async (id: string): Promise<ILabourer | null> => {
    try {
        logger.info(`Fetching labourer with ID: ${id}`);
        if (!mongoose.Types.ObjectId.isValid(id)) {
             logger.warn(`Invalid labourer ID format: ${id}`);
             return null;
        }
        const labourer = await Labourer.findById(id).populate('user').populate('documents');
        if (labourer) {
            logger.info(`Successfully fetched labourer with ID: ${id}`);
        } else {
            logger.warn(`Labourer with ID: ${id} not found`);
        }
        return labourer;
    } catch (error) {
        logger.error(`Error fetching labourer with ID: ${id}`, error);
        throw new Error('Error fetching labourer by ID');
    }
};

// Get labourer by User ID
export const getLabourerByUserId = async (userId: string): Promise<ILabourer | null> => {
    try {
        logger.info(`Fetching labourer associated with User ID: ${userId}`);
         if (!mongoose.Types.ObjectId.isValid(userId)) {
             logger.warn(`Invalid user ID format: ${userId}`);
             return null;
        }
        const labourer = await Labourer.findOne({ user: userId }).populate('user').populate('documents');
        if (labourer) {
            logger.info(`Successfully fetched labourer for User ID: ${userId}`);
        } else {
            logger.warn(`Labourer for User ID: ${userId} not found`);
        }
        return labourer;
    } catch (error) {
        logger.error(`Error fetching labourer by User ID: ${userId}`, error);
        throw new Error('Error fetching labourer by User ID');
    }
};

// Get all contractors
export const getAllLabourers = async (filter: any = {},query: any = {}): Promise<ILabourer[]> => {
    try {
        logger.info('Fetching all Labourerss');
        const contractors = await Labourer.find(filter).populate('user').populate('documents').limit(query?.limit);
        logger.info(`Successfully fetched ${contractors.length} Labourerss`);
        return contractors;
    } catch (error) {
        logger.error('Error fetching all Labourerss:', error);
        throw new Error('Error fetching all Labourerss');
    }
};

// Update labourer by ID
export const updateLabourer = async (id: string, updateData: Partial<ILabourer>): Promise<ILabourer | null> => {
    try {
        logger.info(`Updating labourer with ID: ${id}`);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn(`Invalid labourer ID format for update: ${id}`);
            return null;
        }

        const labourer = await Labourer.findById(id).populate('documents');
        if (!labourer) {
            logger.warn(`Labourer with ID: ${id} not found for update`);
            return null;
        }


        // Handle user updates if provided
        if (updateData.user) {
            await User.findByIdAndUpdate(labourer.user, updateData.user);
        }

        // Handle document updates if provided
        if (updateData.documents) {
            const existingDoc: any = await Documents.findById(labourer.documents).lean();
            let docs = {
                aadhar: {
                    aadharNumber: existingDoc.aadhar.aadharNumber,
                    aadharPhoto: existingDoc.aadhar.aadharPhoto,
                    ...(updateData.documents as any).aadhar
                },
                pancard: {
                    panNumber: existingDoc.pancard.panNumber,
                    panPhoto: existingDoc.pancard.panPhoto,
                    ...(updateData.documents as any).pancard
                }
            }
            await Documents.findByIdAndUpdate(labourer.documents, docs);
        }

        // Handle other labourer fields
        const { user, documents, ...restUpdateData } = updateData;
        
        // Update labourer and get updated version
        const updatedLabourer = await Labourer.findByIdAndUpdate(
            id,
            restUpdateData,
            { new: true, runValidators: true }
        ).populate('user').populate('documents');

        if (updatedLabourer) {
            logger.success(`Labourer updated successfully: ${id}`);
        }

        return updatedLabourer;
    } catch (error) {
        logger.error(`Error updating labourer with ID: ${id}`, error);
        throw new Error('Error updating labourer');
    }
};

// Delete labourer by ID
export const deleteLabourer = async (id: string): Promise<boolean> => {
    try {
        logger.info(`Deleting labourer with ID: ${id}`);
         if (!mongoose.Types.ObjectId.isValid(id)) {
             logger.warn(`Invalid labourer ID format for delete: ${id}`);
             return false;
        }
        const result = await Labourer.findByIdAndDelete(id);
        if (result) {
            logger.success(`Labourer deleted successfully: ${id}`);
            return true;
        } else {
            logger.warn(`Labourer with ID: ${id} not found for deletion`);
            return false;
        }
    } catch (error) {
        logger.error(`Error deleting labourer with ID: ${id}`, error);
        throw new Error('Error deleting labourer');
    }
};