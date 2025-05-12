import InvoiceModel, {Invoice} from '../models/invoice.model.js'
import mongoose from 'mongoose';

export class InvoiceRepository {
  async create(invoiceData: Partial<Invoice>): Promise<Invoice> {
    const invoice = new InvoiceModel(invoiceData);
    return await invoice.save();
  }

  async findById(id: string): Promise<Invoice | null> {
    return await InvoiceModel.findById(id);
  }

  async findByMillOwner(millOwnerId: string): Promise<Invoice[]> {
    return await InvoiceModel.find({ millOwnerId });
  }

  async update(id: string, updateData: Partial<Invoice>): Promise<Invoice | null> {
    return await InvoiceModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async markAsPaid(id: string, paymentDetails: {
    paymentMethod: string;
    transactionId: string;
  }): Promise<Invoice | null> {
    return await InvoiceModel.findByIdAndUpdate(
      id,
      {
        status: 'paid',
        paidAt: new Date(),
        ...paymentDetails
      },
      { new: true }
    );
  }

  async checkOverdueInvoices(): Promise<void> {
    const today = new Date();
    await InvoiceModel.updateMany(
      {
        status: 'unpaid',
        dueDate: { $lt: today }
      },
      { status: 'overdue' }
    );
  }
}