import mongoose, { Schema, Document } from 'mongoose';
import { VerificationStatus } from '../utils/constants.js';

export interface IGuarantor extends Document {
    name: string;
    contact: string;
}

export interface IContractor extends Document {
    user: mongoose.Types.ObjectId;
    documents: mongoose.Types.ObjectId;
    verificationStatus: VerificationStatus;
    isActive: boolean;
    companyName: string;
    location: string;
    address: string;
    companyRegisterationNo: string;
    GST_NO: string;
    ownerName: string;
    ownerContactNo: string;
    Guarantor: IGuarantor[];  // Changed to array of guarantors
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
        ref: 'Documents',
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
    companyName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    companyRegisterationNo: {
        type: String,
        required: true
    },
    GST_NO: {
        type: String,
        required: true,
        unique: true
    },
    ownerName: {
        type: String,
        required: true
    },
    ownerContactNo: {
        type: String,
        required: true
    },
    Guarantor: {
        type: [{ name: String, contact: String }],
        required: true,
        validate: [
            { 
                validator: function (guarantors: IGuarantor[]) {
                    return guarantors.length > 0;
                },
                message: 'At least one guarantor is required'
            }
        ]
    }
}, {
    timestamps: true
});

contractorSchema.index({ user: 1 });
contractorSchema.index({ verificationStatus: 1 });
contractorSchema.index({ isActive: 1 });

export default mongoose.model<IContractor>('Contractor', contractorSchema);