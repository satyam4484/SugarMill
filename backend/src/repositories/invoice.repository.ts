import InvoiceModel, {Invoice} from '../models/invoice.model.js'
import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export class InvoiceRepository {
  static async create(invoiceData: Partial<Invoice>): Promise<any> {
    const response: any = {
      isError: false,
      message: ''
    };
    try {
      logger.info('Creating a new invoice');
      const invoice = new InvoiceModel(invoiceData);
      await invoice.save();
      logger.success('Invoice created successfully');
      response.message = 'Invoice created successfully';
      response.data = invoice;
    } catch (error) {
      logger.error('Error creating invoice:', error);
      response.isError = true;
      response.message = 'Error creating invoice';
    } finally {
      return response;
    }
  }

  static async findById(id: string): Promise<any> {
    const response: any = {
      isError: false,
      message: ''
    };
    try {
      logger.info(`Fetching invoice with ID: ${id}`);
      if (!mongoose.Types.ObjectId.isValid(id)) {
        response.isError = true;
        response.message = 'Invalid invoice ID format';
        return response;
      }
      const invoice = await InvoiceModel.findById(id).populate('millOwnerId');
      if (invoice) {
        logger.info(`Successfully fetched invoice with ID: ${id}`);
        response.data = invoice;
        response.message = 'Invoice fetched successfully';
      } else {
        response.isError = true;
        response.message = 'Invoice not found';
      }
    } catch (error) {
      logger.error(`Error fetching invoice with ID: ${id}`, error);
      response.isError = true;
      response.message = 'Error fetching invoice';
    } finally {
      return response;
    }
  }

  static async findAllInvoice(filter?: any, query?: any): Promise<any> {
    const response: any = {
      isError: false,
      message: ''
    };
    try {
      logger.info('Fetching all invoices');
      const invoices = await InvoiceModel.find(filter)
        .populate('millOwnerId')
        .limit(query?.limit)
        .lean()
        .exec();
      
      logger.info(`Successfully fetched ${invoices.length} invoices`);
      response.data = invoices;
      response.message = 'Invoices fetched successfully';
    } catch (error) {
      logger.error('Error fetching all invoices:', error);
      response.isError = true;
      response.message = 'Error fetching invoices';
    } finally {
      return response;
    }
  }

  static async findByMillOwner(millOwnerId: string): Promise<any> {
    const response: any = {
      isError: false,
      message: ''
    };
    try {
      logger.info(`Fetching invoices for mill owner: ${millOwnerId}`);
      const invoices = await InvoiceModel.find({ millOwnerId }).populate('millOwnerId');
      response.data = invoices;
      response.message = 'Mill owner invoices fetched successfully';
    } catch (error) {
      logger.error(`Error fetching mill owner invoices: ${millOwnerId}`, error);
      response.isError = true;
      response.message = 'Error fetching mill owner invoices';
    } finally {
      return response;
    }
  }

  static async markAsPaid(id: string, paymentDetails: {
    paymentMethod: string;
    transactionId: string;
  }): Promise<any> {
    const response: any = {
      isError: false,
      message: ''
    };
    try {
      logger.info(`Marking invoice as paid: ${id}`);
      if (!mongoose.Types.ObjectId.isValid(id)) {
        response.isError = true;
        response.message = 'Invalid invoice ID format';
        return response;
      }
      const invoice = await InvoiceModel.findByIdAndUpdate(
        id,
        {
          status: 'paid',
          paidAt: new Date(),
          ...paymentDetails
        },
        { new: true }
      ).populate('millOwnerId');
      
      if (invoice) {
        logger.success(`Invoice marked as paid successfully: ${id}`);
        response.data = invoice;
        response.message = 'Invoice marked as paid successfully';
      } else {
        response.isError = true;
        response.message = 'Invoice not found';
      }
    } catch (error) {
      logger.error(`Error marking invoice as paid: ${id}`, error);
      response.isError = true;
      response.message = 'Error marking invoice as paid';
    } finally {
      return response;
    }
  }

  static async delete(id: string): Promise<any> {
    const response: any = {
      isError: false,
      message: ''
    };
    try {
      logger.info(`Deleting invoice with ID: ${id}`);
      if (!mongoose.Types.ObjectId.isValid(id)) {
        response.isError = true;
        response.message = 'Invalid invoice ID format';
        return response;
      }
      const invoice = await InvoiceModel.findByIdAndDelete(id);
      if (invoice) {
        logger.info(`Successfully deleted invoice with ID: ${id}`);
        response.message = 'Invoice deleted successfully';
      } else {
        response.isError = true;
        response.message = 'Invoice not found';
      }
    } catch (error) {
      logger.error(`Error deleting invoice with ID: ${id}`, error);
      response.isError = true;
      response.message = 'Error deleting invoice';
    } finally {
      return response;
    }
  }

  static async update(id: string, updateData: Partial<Invoice>): Promise<any> {
    const response: any = {
      isError: false,
      message: ''
    };
    try {
      logger.info(`Updating invoice with ID: ${id}`);
      if (!mongoose.Types.ObjectId.isValid(id)) {
        response.isError = true;
        response.message = 'Invalid invoice ID format';
        return response;
      }
      const invoice = await InvoiceModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      ).populate('millOwnerId');
      if (invoice) {
        logger.info(`Successfully updated invoice with ID: ${id}`);
        response.data = invoice;
        response.message = 'Invoice updated successfully';
      } else {
        response.isError = true;
        response.message = 'Invoice not found';
      }
    } catch (error) {
      logger.error(`Error updating invoice with ID: ${id}`, error);
      response.isError = true;
      response.message = 'Error updating invoice';
    } finally {
      return response;
    }
  }
}