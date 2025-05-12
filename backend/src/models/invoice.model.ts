import mongoose, { Document, Schema } from 'mongoose';

export interface Invoice extends Document {
  invoiceNumber: string;
  millOwnerId: mongoose.Types.ObjectId;
  amount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  dueDate: Date;
  createdAt: Date;
  description?: string;
  paidAt?: Date;
  paymentMethod?: string;
  transactionId?: string;
}

const invoiceSchema = new Schema<Invoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    millOwnerId: { type: Schema.Types.ObjectId, ref: 'MillOwner', required: true },
    amount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['paid', 'unpaid', 'overdue'],
      default: 'unpaid'
    },
    dueDate: { type: Date, required: true },
    description: { type: String },
    paidAt: { type: Date },
    paymentMethod: { type: String },
    transactionId: { type: String }
  },
  { timestamps: true }
);

const  InvoiceModel = mongoose.model<Invoice>('Invoice', invoiceSchema);
export default InvoiceModel;