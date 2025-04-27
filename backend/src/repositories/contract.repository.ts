import Contract, { IContract } from '../models/contract.model.js';
import logger from '../utils/logger.js';

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

export const getAllContracts = async (filter: any): Promise<any> => {
    const response: any = {
        isError: false,
        message: '',
    };
    try {
        logger.info('Fetching all contracts');
        const contracts = await Contract.find(filter)
            .populate('millOwner')
            .populate('contractor')
            .populate('laborers');
        logger.info(`Successfully fetched ${contracts.length} contracts`);
        response.data = contracts;
    } catch (error) {
        logger.error('Error fetching contracts:', error);
        response.isError = true;
        response.message = 'Error fetching contracts';
    } finally {
        return response;
    }
};

export const getContractById = async (id: string): Promise<any> => {
    const response: any = {
        isError: false,
        message: '',
    };
    try {
        logger.info(`Fetching contract with ID: ${id}`);
        const contract = await Contract.findById(id)
            .populate('millOwner')
            .populate('contractor')
            .populate('laborers');
        
        if (!contract) {
            response.isError = true;
            response.message = 'Contract not found';
            return response;
        }
        
        response.data = contract;
    } catch (error) {
        logger.error(`Error fetching contract with ID ${id}:`, error);
        response.isError = true;
        response.message = 'Error fetching contract';
    } finally {
        return response;
    }
};

export const updateContract = async (id: string, updateData: Partial<IContract>): Promise<any> => {
    const response: any = {
        isError: false,
        message: '',
    };
    try {
        logger.info(`Updating contract with ID: ${id}`);
        const contract = await Contract.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).populate('millOwner')
         .populate('contractor')
         .populate('laborers');

        if (!contract) {
            response.isError = true;
            response.message = 'Contract not found';
            return response;
        }

        logger.success('Contract updated successfully');
        response.message = 'Contract updated successfully';
        response.data = contract;
    } catch (error) {
        logger.error(`Error updating contract with ID ${id}:`, error);
        response.isError = true;
        response.message = 'Error updating contract';
    } finally {
        return response;
    }
};

export const deleteContract = async (id: string): Promise<any> => {
    const response: any = {
        isError: false,
        message: '',
    };
    try {
        logger.info(`Deleting contract with ID: ${id}`);
        const contract = await Contract.findByIdAndDelete(id);

        if (!contract) {
            response.isError = true;
            response.message = 'Contract not found';
            return response;
        }

        logger.success('Contract deleted successfully');
        response.message = 'Contract deleted successfully';
    } catch (error) {
        logger.error(`Error deleting contract with ID ${id}:`, error);
        response.isError = true;
        response.message = 'Error deleting contract';
    } finally {
        return response;
    }
};