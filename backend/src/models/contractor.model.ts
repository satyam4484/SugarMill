import mongoose, { Schema, Document } from 'mongoose';
import { VerificationStatus } from '../utils/constants.js';



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
    // Guarantor: IGuarantor[];  
    laboursCount:number;
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
    laboursCount:{
        type : Number,
        default: 0
    }
}, {
    timestamps: true
});

contractorSchema.index({ user: 1 });
contractorSchema.index({ verificationStatus: 1 });
contractorSchema.index({ isActive: 1 });

export default mongoose.model<IContractor>('Contractor', contractorSchema);