import mongoose, { Schema, Document } from 'mongoose';
import { VerificationStatus } from '../utils/constants.js';
import { GenderValues } from '../utils/constants.js';

export interface ILabourer extends Document {
    user: mongoose.Types.ObjectId;
    documents: mongoose.Types.ObjectId;
    verificationStatus: VerificationStatus;
    isActive: boolean;
    contractor: mongoose.Types.ObjectId; 
    Age: number;
    Gender:GenderValues;
    profilePicture: string;
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
    contractor:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Age: {
        type: Number,
        required: true,
        min: 0
    },
    Gender: {
        type: String,
        enum: Object.values(GenderValues),
        required: true
    },
    profilePicture: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model<ILabourer>('Labourer', LabourerSchema);