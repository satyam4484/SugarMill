import mongoose, { Document, Schema } from 'mongoose';

export interface IPlan extends Document {
  name: string;
  description: string;
  price: number;
  billingCycle: string;
  features: {
    maxContracts: number | 'unlimited';
    conflictDetection: string;
    storageLimit: number;
    support: string;
    analytics?: boolean;
    dedicatedManager?: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<IPlan>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    billingCycle: {
      type: String,
      required: true,
      enum: ['monthly', 'yearly'],
      default: 'yearly',
    },
    features: {
      maxContracts: {
        type: Schema.Types.Mixed,
        required: true,
      },
      conflictDetection: {
        type: String,
        required: true,
      },
      storageLimit: {
        type: Number,
        required: true,
      },
      support: {
        type: String,
        required: true,
      },
      analytics: {
        type: Boolean,
        default: false,
      },
      dedicatedManager: {
        type: Boolean,
        default: false,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPlan>('Plan', planSchema);