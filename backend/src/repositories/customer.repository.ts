import CustomerRequest, { ICustomerRequest } from '../models/customer.model.js';
import logger from '../utils/logger.js';

export const createCustomer = async (customerData: ICustomerRequest): Promise<any> => {
    const response: any = {
        isError: false,
        message: '',
    };
    try {
        logger.info('Creating a new customer request');
        const customerRequest = new CustomerRequest(customerData);
        await customerRequest.save();
        logger.success('Customer request created successfully');
        response.message = 'Customer request created successfully';
        response.data = customerRequest;
    } catch (error) {
        logger.error('Error creating customer request:', error);
        response.isError = true;
        response.message = 'Error creating customer request';
        response.errorDetails = error; // Add this line to include error details in the response
    } finally {
        return response;
    }
};


export const getAllCustomers = async (filter: any): Promise<any> => {
    const response: any = {
        isError: false,
        message: '',
    };
    try {
        logger.info('Fetching all customer requests');
        const customerRequests = await CustomerRequest.find(filter);
        logger.info(`Successfully fetched ${customerRequests.length} customer requests`);
        response.data = customerRequests;
    } catch (error) {
        logger.error('Error fetching customer requests:', error);
        response.isError = true;
        response.message = 'Error fetching customer requests';
    } finally {
        return response;
    }
};

// Add more methods as needed (e.g., getCustomerById, updateCustomer, deleteCustomer)