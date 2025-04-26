import Contractor, { IContractor } from '../models/contractor.model.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

// Create a new contractor
export const createContractor = async (contractorData: Partial<IContractor>): Promise<IContractor> => {
    try {
        logger.info('Creating a new contractor record');
        const contractor = new Contractor(contractorData);
        await contractor.save();
        logger.success(`Contractor created successfully with ID: ${contractor._id}`);
        return contractor;
    } catch (error) {
        logger.error('Error creating contractor:', error);
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
export const getAllContractors = async (): Promise<IContractor[]> => {
    try {
        logger.info('Fetching all contractors');
        const contractors = await Contractor.find().populate('user').populate('documents');
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