import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
    aadhar: {
        aadharNumber: string;
        aadharFrontPhoto: string;
        aadharBackPhoto: string;
        isAadharVerified: boolean;
    },
    pancard: {
        panNumber: string;
        panPhoto: string;
        isPanVerified: boolean;
    }
}

const aadharSchema = new Schema({
    aadharNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function(v: string) {
                return /^\d{12}$/.test(v);
            },
            message: 'Aadhar number must be 12 digits'
        }
    },
    aadharFrontPhoto: {
        type: String,
        required: true
    },
    aadharBackPhoto: {
        type: String,
        required: true
    },
    isAadharVerified: {
        type: Boolean,
        default: false
    }
});

const pancardSchema = new Schema({
    panNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
        validate: {
            validator: function(v: string) {
                return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
            },
            message: 'Invalid PAN number format'
        }
    },
    panPhoto: {
        type: String,
        required: true
    },
    isPanVerified: {
        type: Boolean,
        default: false
    }
});

const documentSchema = new Schema({
    aadhar: aadharSchema,
    pancard: pancardSchema,
    
}, {
    timestamps: true
});

// Indexes for faster queries
documentSchema.index({ 'aadhar.aadharNumber': 1 });
documentSchema.index({ 'pancard.panNumber': 1 });

export default mongoose.model<IDocument>('Documents', documentSchema);




