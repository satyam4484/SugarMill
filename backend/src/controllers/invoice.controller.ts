import { Request, Response } from 'express';
import { InvoiceRepository } from '../repositories/invoice.repository.js';

export class InvoiceController {
  private invoiceRepository: InvoiceRepository;

  constructor() {
    this.invoiceRepository = new InvoiceRepository();
  }

  async createInvoice(req: Request, res: Response) {
    try {
      const invoice = await this.invoiceRepository.create(req.body);
      res.status(201).json(invoice);
    } catch (error) {
      res.status(400).json({ message: 'Failed to create invoice', error });
    }
  }

  async getInvoice(req: Request, res: Response) {
    try {
      const invoice = await this.invoiceRepository.findById(req.params.id);
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
      res.json(invoice);
    } catch (error) {
      res.status(400).json({ message: 'Failed to get invoice', error });
    }
  }

  async getMillOwnerInvoices(req: Request, res: Response) {
    try {
      const invoices = await this.invoiceRepository.findByMillOwner(req.params.millOwnerId);
      res.json(invoices);
    } catch (error) {
      res.status(400).json({ message: 'Failed to get mill owner invoices', error });
    }
  }

  async markInvoiceAsPaid(req: Request, res: Response) {
    try {
      const invoice = await this.invoiceRepository.markAsPaid(req.params.id, req.body);
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
      res.json(invoice);
    } catch (error) {
      res.status(400).json({ message: 'Failed to mark invoice as paid', error });
    }
  }
}