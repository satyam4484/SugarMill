import mongoose, { Document, Schema } from "mongoose";
import { UserRole, VerificationStatus } from "../utils/constants.js";
import logger from "../utils/logger.js";

export interface ICustomerRequest extends Document {
    name: string;
    contactNo: string;
    email: string;
    role: UserRole;
    description: string;
    Status: VerificationStatus;
}

const customerRequestSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    contactNo: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function(v: string) {
                return /^\d{10}$/.test(v); // Example regex for 10-digit phone numbers
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v: string) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v); // Basic email regex
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    Status: {
        type: String,
        enum: Object.values(VerificationStatus),
        default: VerificationStatus.PENDING
    }
}, {
    timestamps: true
});

// Pre-save hook to check for existing email and contact number
customerRequestSchema.pre('save', async function(next) {
    const customer = this;
    try {
        const existingEmail = await mongoose.models.CustomerRequest.findOne({ email: customer.email });
        if (existingEmail) {
            logger.error('Email already exists');
            throw new Error('Email already exists');
        }
        const existingContactNo = await mongoose.models.CustomerRequest.findOne({ contactNo: customer.contactNo });
        if (existingContactNo) {
            logger.error('Contact number already exists');
            throw new Error('Contact number already exists');
        }
        next();
    } catch (error) {
        next(error as any); // Explicitly cast error to CallbackError
    }
});

export default mongoose.model<ICustomerRequest>('CustomerRequest', customerRequestSchema);
