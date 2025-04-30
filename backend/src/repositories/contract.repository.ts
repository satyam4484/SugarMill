import mongoose from 'mongoose';
import Contract, { IContract } from '../models/contract.model.js';
import logger from '../utils/logger.js';
import Labourer , {ILabourer} from "../models/labour.model.js"

// Create a new contract
export const createContract = async (contractData: IContract): Promise<any> => {
    const response: any = {
        isError: false,
        message: '',
    };
    try {
        logger.info('Creating a new contract');
        const contract = new Contract(contractData);
        await contract.save();
        logger.success('Contract created successfully');
        response.message = 'Contract created successfully';
        response.data = contract;
    } catch (error) {
        logger.error('Error creating contract:', error);
        response.isError = true;
        response.message = 'Error creating contract';
    } finally {
        return response;
    }
};

// Get contract by ID
export const getContractById = async (id: string): Promise<any> => {
    const response: any = {
        isError: false,
        message: '',
    };
    try {
        logger.info(`Fetching contract with ID: ${id}`);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            response.isError = true;
            response.message = 'Invalid contract ID format';
            return response;
        }
        const contract = await Contract.findById(id)
            .populate('millOwner')
            .populate('contractor')
            .populate('labourers');
        if (contract) {
            logger.info(`Successfully fetched contract with ID: ${id}`);
            response.data = contract;
            response.message = 'Contract fetched successfully';
        } else {
            response.isError = true;
            response.message = 'Contract not found';
        }
    } catch (error) {
        logger.error(`Error fetching contract with ID: ${id}`, error);
        response.isError = true;
        response.message = 'Error fetching contract';
    } finally {
        return response;
    }
};

// Get all contracts
export const getAllContracts = async (query?: any): Promise<any> => {
    const response: any = {
        isError: false,
        message: '',
    };
    try {
        logger.info('Fetching all contracts');
        const contracts = await Contract.find(query).populate([
            {
                path: 'millOwner',
                populate: {
                    path: 'user',
                    select: 'name contactNo'
                }
            },
            {
                path: 'contractor',
                populate: {
                    path: 'user',
                    select: 'name contactNo'
                }
            }
        ]).lean().exec();
        
        const contractsWithCount = contracts.map(contract => ({
            ...contract,
            totalLabourers: contract.labourers?.length || 0
        }));

        logger.info(`Successfully fetched ${contracts.length} contracts`);
        response.data = contractsWithCount;
        response.message = 'Contracts fetched successfully';
    } catch (error) {
        logger.error('Error fetching all contracts:', error);
        response.isError = true;
        response.message = 'Error fetching contracts';
    } finally {
        return response;
    }
};

// Update contract by ID
export const updateContract = async (id: string, updateData: Partial<IContract>): Promise<any> => {
    const response: any = {
        isError: false,
        message: '',
    };
    try {
        logger.info(`Updating contract with ID: ${id}`);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            response.isError = true;
            response.message = 'Invalid contract ID format';
            return response;
        }
        const contract = await Contract.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('millOwner').populate('contractor').populate('labourers');
        
        if (contract) {
            logger.success(`Contract updated successfully: ${id}`);
            response.data = contract;
            response.message = 'Contract updated successfully';
        } else {
            response.isError = true;
            response.message = 'Contract not found';
        }
    } catch (error) {
        logger.error(`Error updating contract with ID: ${id}`, error);
        response.isError = true;
        response.message = 'Error updating contract';
    } finally {
        return response;
    }
};

// Delete contract by ID
export const deleteContract = async (id: string): Promise<any> => {
    const response: any = {
        isError: false,
        message: '',
    };
    try {
        logger.info(`Deleting contract with ID: ${id}`);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            response.isError = true;
            response.message = 'Invalid contract ID format';
            return response;
        }
        const result = await Contract.findByIdAndDelete(id);
        if (result) {
            logger.success(`Contract deleted successfully: ${id}`);
            response.message = 'Contract deleted successfully';
        } else {
            response.isError = true;
            response.message = 'Contract not found';
        }
    } catch (error) {
        logger.error(`Error deleting contract with ID: ${id}`, error);
        response.isError = true;
        response.message = 'Error deleting contract';
    } finally {
        return response;
    }
};


export const findAvailableLabourers = async (contractorId: string, startDate: Date, endDate: Date): Promise<any> => {
    const response: any = {
        isError: false,
        message: '',
    };
    try {
        logger.info('Finding available labourers');
        // 1. Find all labourers under this contractor
        const allLabourers = await Labourer.find({ contractor: contractorId, isActive: true }).populate({
            path:'user',
            select:'name contactNo'
        }).populate({
            path:'documents',
            select:'aadhar'
        });

        const allLabourerIds = allLabourers.map(labourer => labourer._id);

        // 2. Find labourers who are already assigned to overlapping contracts
        const busyContracts = await Contract.find({
            labourers: { $in: allLabourerIds },
            startDate: { $lte: endDate },   // Contract starts before your end
            endDate: { $gte: startDate }     // Contract ends after your start
        });

        const busyLabourerIds = busyContracts.flatMap(contract => 
            contract.labourers.map(id => id.toString())
        );

        // 3. Filter out busy labourers
        const freeLabourers = allLabourers.filter((labourer:any)=> 
            !busyLabourerIds.includes(labourer._id.toString())
        );

        response.data = freeLabourers;
        response.message = 'Available labourers fetched successfully';
    } catch (error) {
        logger.error('Error finding available labourers:', error);
        response.isError = true;
        response.message = 'Error finding available labourers';
    } finally {
        return response;
    }
};