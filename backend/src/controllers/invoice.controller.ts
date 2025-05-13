import { Request, Response } from 'express';
import { InvoiceRepository } from '../repositories/invoice.repository.js';
import logger from '../utils/logger.js';

export class InvoiceController {
  static async create(req: Request, res: Response): Promise<Response> {
    try {
      const invoiceData = req.body;
      const response = await InvoiceRepository.create(invoiceData);
      if (response.isError) {
        return res.status(400).json(response);
      }
      return res.status(201).json(response);
    } catch (error) {
      logger.error('Error creating invoice:', error);
      return res.status(500).json({ message: 'Failed to create invoice' });
    }
  }

  static async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const response = await InvoiceRepository.findById(id);
      if (response.isError) {
        return res.status(404).json(response);
      }
      return res.status(200).json(response);
    } catch (error) {
      logger.error('Error fetching invoice by ID:', error);
      return res.status(500).json({ message: 'Error fetching invoice' });
    }
  }

  static async getAll(req: any, res: Response): Promise<Response> {
    try {
      const query = req.query;
      let filter: any = {};
      if (req?.mill) {
        filter.millOwnerId = req.mill._id;
      }
      if (query?.status) {
        filter.status = query.status;
      }
      const response = await InvoiceRepository.findAllInvoice(filter, query);
      if (response.isError) {
        return res.status(400).json(response);
      }
      return res.status(200).json(response);
    } catch (error) {
      logger.error('Error fetching all invoices:', error);
      return res.status(500).json({ message: 'Error fetching invoices' });
    }
  }

  static async getMillOwnerInvoices(req: Request, res: Response): Promise<Response> {
    try {
      const { millOwnerId } = req.params;
      const response = await InvoiceRepository.findByMillOwner(millOwnerId);
      if (response.isError) {
        return res.status(404).json(response);
      }
      return res.status(200).json(response);
    } catch (error) {
      logger.error('Error fetching mill owner invoices:', error);
      return res.status(500).json({ message: 'Error fetching mill owner invoices' });
    }
  }

  static async markAsPaid(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const response = await InvoiceRepository.markAsPaid(id, req.body);
      if (response.isError) {
        return res.status(404).json(response);
      }
      return res.status(200).json(response);
    } catch (error) {
      logger.error('Error marking invoice as paid:', error);
      return res.status(500).json({ message: 'Error marking invoice as paid' });
    }
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const response = await InvoiceRepository.delete(id);
      if (response.isError) {
        return res.status(404).json(response);
      }
      return res.status(200).json(response);
    } catch (error) {
      logger.error('Error deleting invoice:', error);
      return res.status(500).json({ message: 'Error deleting invoice' });
    }
  }

  static async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const response = await InvoiceRepository.update(id, updateData);
      if (response.isError) {
        return res.status(404).json(response);
      }
      return res.status(200).json(response);
    } catch (error) {
      logger.error('Error updating invoice:', error);
      return res.status(500).json({ message: 'Error updating invoice' });
    }
  }
}