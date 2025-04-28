import mongoose, { Schema, Document } from 'mongoose';

interface IDocuments {
    license: string;
    gst: string;
}

interface ISubscription {
    startDate: Date;
    endDate: Date;
    isActive: boolean;
}

export interface IMill extends Document {
    name: string;
    user: mongoose.Types.ObjectId;
    subscription: ISubscription;
    location: string;
    address: string;
    GST_NO: string;
}

const millSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    documents: {
        license: {
            type: String,
            required: true
        },  
        gst: {
            type: String,
            required: true
        }
    },
    subscription: {
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    location: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    GST_NO: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model<IMill>('Mill', millSchema);