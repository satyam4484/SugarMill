import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../utils/constants.js';
import bcrypt from 'bcrypt';
import { GenderValues } from '../utils/constants.js';

export interface IUser extends Document {
    userId: string;
    name: string;
    email: string;
    passwordHash: string;
    age: number;
    gender: GenderValues;
    role: UserRole;
    isVerified: boolean;
    contactNo: string;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: Object.values(GenderValues),
        required: true
    },
    contactNo: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('passwordHash')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model<IUser>('User', userSchema);
