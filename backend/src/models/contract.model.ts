import mongoose, { Document, Schema } from "mongoose";
import { VerificationStatus } from "../utils/constants.js";

export interface IGuarantor extends Document {
    name: string;
    contact: string;
}

// Interface for Contract
export interface IContract extends Document {
    millOwner: mongoose.Types.ObjectId;
    contractor: mongoose.Types.ObjectId;
    startDate: Date;    
    endDate: Date;
    additionalNotes: string;
    agreement: string;
    advanceAmount: number;
    status: VerificationStatus;
    labourers: mongoose.Types.ObjectId[];
    Guarantor: mongoose.Types.ObjectId[];
}

// Schema for Contract
const contractSchema = new Schema({
    millOwner: {
        type: Schema.Types.ObjectId,
        ref: 'Mill',
        required: true
    },
    contractor: {
        type: Schema.Types.ObjectId,
        ref: 'Contractor',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(this: IContract, endDate: Date) {
                return endDate > this.startDate;
            },
            message: 'End date must be after start date'
        }
    },
    advanceAmount: {
        type: Number,
        required: true,
        min: 0
    },
    additionalNotes: {
        type: String,
        trim: true
    },
    agreement: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(VerificationStatus),
        default: VerificationStatus.PENDING,
        required: true
    },
    labourers: [{
        type: Schema.Types.ObjectId,
        ref: 'Labourer'
    }],
    Guarantor: [{
       type: Schema.Types.ObjectId,
        ref: 'Contractor'
    }]
}, {
    timestamps: true
});

// Indexes for better query performance
contractSchema.index({ millOwner: 1, contractor: 1, labourers:1 });
contractSchema.index({ startDate: 1, endDate: 1 });
contractSchema.index({ status: 1 });

export default mongoose.model<IContract>('Contract', contractSchema);

