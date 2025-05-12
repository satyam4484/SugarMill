import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  millOwnerId: Schema.Types.ObjectId;
  planId: Schema.Types.ObjectId;
  status: 'active' | 'expired' | 'pending';
  startDate: Date;
  endDate: Date;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  autoRenew: boolean;
  lastBillingDate: Date;
  nextBillingDate: Date;
  paymentHistory: Array<{
    amount: number;
    date: Date;
    status: 'success' | 'failed';
    transactionId: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    millOwnerId: {
      type: Schema.Types.ObjectId,
      ref: 'MillOwner',
      required: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'pending'],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'yearly',
    },
    autoRenew: {
      type: Boolean,
      default: false,
    },
    lastBillingDate: {
      type: Date,
      required: true,
    },
    nextBillingDate: {
      type: Date,
      required: true,
    },
    paymentHistory: [
      {
        amount: Number,
        date: Date,
        status: {
          type: String,
          enum: ['success', 'failed'],
        },
        transactionId: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISubscription>('Subscription', subscriptionSchema);