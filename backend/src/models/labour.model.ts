import mongoose, { Schema, Document } from 'mongoose';
import { VerificationStatus } from '../utils/constants.js';

export interface ILabourer extends Document {
    user: mongoose.Types.ObjectId;
    documents: mongoose.Types.ObjectId;
    verificationStatus: VerificationStatus;
    isActive: boolean;
    experience: number;
    
}

const LabourerSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    documents: {
        type: Schema.Types.ObjectId,
        ref: 'Documents',
        required: true,
        unique: true
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
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model<ILabourer>('Labourer', LabourerSchema);