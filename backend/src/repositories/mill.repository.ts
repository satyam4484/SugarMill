import mongoose from 'mongoose';
import Mill, { IMill } from '../models/mill.model.js';
import logger from '../utils/logger.js';

// Create a new mill
export const createMill = async (millData: Partial<IMill>): Promise<IMill> => {
    try {
        logger.info('Creating a new mill record');
        const mill = new Mill(millData);
        await mill.save();
        logger.success(`Mill created successfully with ID: ${mill._id}`);
        return mill;
    } catch (error) {
        logger.error('Error creating mill:', error);
        throw new Error('Failed to create mill');
    }
};

// Get mill by ID
export const getMillById = async (id: string): Promise<IMill | null> => {
    try {
        logger.info(`Fetching mill with ID: ${id}`);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn(`Invalid mill ID format: ${id}`);
            return null;
        }
        const mill = await Mill.findById(id).populate('user');
        if (mill) {
            logger.info(`Successfully fetched mill with ID: ${id}`);
        } else {
            logger.warn(`Mill with ID: ${id} not found`);
        }
        return mill;
    } catch (error) {
        logger.error(`Error fetching mill with ID: ${id}`, error);
        throw new Error('Error fetching mill by ID');
    }
};

// Update mill by ID
export const updateMill = async (id: string, updateData: Partial<IMill>): Promise<IMill | null> => {
    try {
        logger.info(`Updating mill with ID: ${id}`);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn(`Invalid mill ID format for update: ${id}`);
            return null;
        }
        const mill = await Mill.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate('user');
        if (mill) {
            logger.success(`Mill updated successfully: ${id}`);
        } else {
            logger.warn(`Mill with ID: ${id} not found for update`);
        }
        return mill;
    } catch (error) {
        logger.error(`Error updating mill with ID: ${id}`, error);
        throw new Error('Error updating mill');
    }
};

// Delete mill by ID
export const deleteMill = async (id: string): Promise<boolean> => {
    try {
        logger.info(`Deleting mill with ID: ${id}`);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn(`Invalid mill ID format for delete: ${id}`);
            return false;
        }
        const result = await Mill.findByIdAndDelete(id);
        if (result) {
            logger.success(`Mill deleted successfully: ${id}`);
            return true;
        } else {
            logger.warn(`Mill with ID: ${id} not found for deletion`);
            return false;
        }
    } catch (error) {
        logger.error(`Error deleting mill with ID: ${id}`, error);
        throw new Error('Error deleting mill');
    }
};

export const getAllMills = async (): Promise<IMill[]> => {
    try {
        logger.info('Fetching all mills from the database');
        const mills = await Mill.find().populate('user').populate('documents');
        logger.info(`Successfully fetched ${mills.length} mills`);
        return mills;
    } catch (error) {
        logger.error('Error fetching all mills:', error);
        throw new Error('Error fetching all mills');
    }
};