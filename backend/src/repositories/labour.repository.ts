import Labourer, { ILabourer } from '../models/labour.model.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

// Create a new labourer
export const createLabour = async (contractorData: Partial<ILabourer>): Promise<ILabourer> => {
    try {
        logger.info('Creating a new labourer record');
        const labourer = new Labourer(contractorData);
        await labourer.save();
        logger.success(`Labourer created successfully with ID: ${labourer._id}`);
        return labourer;
    } catch (error) {
        logger.error('Error creating labourer:', error);
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
export const getAllLabourers = async (filter: any = {}): Promise<ILabourer[]> => {
    try {
        logger.info('Fetching all contractors');
        const contractors = await Labourer.find(filter).populate('user').populate('documents');
        logger.info(`Successfully fetched ${contractors.length} contractors`);
        return contractors;
    } catch (error) {
        logger.error('Error fetching all contractors:', error);
        throw new Error('Error fetching all contractors');
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
        // Ensure user and documents fields are not accidentally overwritten if not provided
        const { user, documents, ...restUpdateData } = updateData;

        const labourer = await Labourer.findByIdAndUpdate(id, restUpdateData, { new: true, runValidators: true }).populate('user').populate('documents');
        if (labourer) {
            logger.success(`Labourer updated successfully: ${id}`);
        } else {
            logger.warn(`Labourer with ID: ${id} not found for update`);
        }
        return labourer;
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