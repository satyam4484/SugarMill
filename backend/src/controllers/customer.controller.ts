import { Request, Response } from 'express';
import * as CustomerRepository from '../repositories/customer.repository.js';
import logger from '../utils/logger.js';

export class CustomerController {
    static async createCustomerRequest(req: Request, res: Response): Promise<Response> {
        try {
            const customerData = req.body;
            const response = await CustomerRepository.createCustomer(customerData);
            if (response.isError) {
                logger.error(response.message);
                return res.status(400).json({ success: false, message: response.message });
            }
            return res.status(201).json({ success: true, message: response.message, data: response.data });
        } catch (error) {
            logger.error('Unexpected error creating customer request:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }

    static async getCustomerRequests(req: Request, res: Response): Promise<Response> {
        try {
            const filter = {}; // Define any filter criteria if needed
            const response = await CustomerRepository.getAllCustomers(filter);
            if (response.isError) {
                logger.error(response.message);
                return res.status(500).json({ success: false, message: response.message });
            }
            logger.info(`Fetched ${response.data.length} customer requests`);
            return res.status(200).json({ success: true, data: response.data });
        } catch (error) {
            logger.error('Unexpected error fetching customer requests:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
}

// Add more methods as needed (e.g., updateCustomerRequest, deleteCustomerRequest)
