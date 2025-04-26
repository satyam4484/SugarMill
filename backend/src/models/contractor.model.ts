import mongoose, { Schema, Document } from 'mongoose';
import { VerificationStatus } from '../utils/constants.js';

export interface IContractor extends Document {
    user: mongoose.Types.ObjectId;
    documents: mongoose.Types.ObjectId;
    verificationStatus: VerificationStatus;
    isActive: boolean;
    experience: number; 
    specialization: string[];
}

const contractorSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    documents: {
        type: Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    verificationStatus: {
        type: String,
        enum: Object.values(VerificationStatus),
        default: VerificationStatus.PENDING
    },
    isActive: {
        type: Boolean,
        default: true
    },
    experience: {
        type: Number,
        required: true,
        min: 0
    },
    specialization: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Indexes for faster queries
contractorSchema.index({ user: 1 });
contractorSchema.index({ verificationStatus: 1 });
contractorSchema.index({ isActive: 1 });

export default mongoose.model<IContractor>('Contractor', contractorSchema);