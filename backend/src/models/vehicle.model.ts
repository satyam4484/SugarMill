import mongoose, { Document, Schema } from 'mongoose';

export enum VehicleType {
    TRUCK = 'TRUCK',
    TRACTOR = 'TRACTOR',
    HARVESTER = 'HARVESTER',
    OTHER = 'OTHER'
}

export enum VehicleStatus {
    PERMANENT = 'PERMANENT',
    RENTED = 'RENTED',
    AVAILABLE = 'AVAILABLE'
}

export interface IVehicle extends Document {
    vehicleNumber: string;
    vehicleType: VehicleType;
    contractor: mongoose.Types.ObjectId;
    status: VehicleStatus;
    currentRental?: {
        mill: mongoose.Types.ObjectId;
        startDate: Date;
        endDate: Date;
        rentalRate: number;
    };
    rentalHistory: Array<{
        mill: mongoose.Types.ObjectId;
        startDate: Date;
        endDate: Date;
        rentalRate: number;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const vehicleSchema = new Schema({
    vehicleNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    vehicleType: {
        type: String,
        enum: Object.values(VehicleType),
        required: true
    },
    contractor: {
        type: Schema.Types.ObjectId,
        ref: 'Contractor',
        required: true
    },
    status: {
        type: String,
        enum: Object.values(VehicleStatus),
        default: VehicleStatus.AVAILABLE
    },
    currentRental: {
        mill: {
            type: Schema.Types.ObjectId,
            ref: 'Mill'
        },
        startDate: Date,
        endDate: Date,
        rentalRate: Number
    },
    rentalHistory: [{
        mill: {
            type: Schema.Types.ObjectId,
            ref: 'Mill'
        },
        startDate: Date,
        endDate: Date,
        rentalRate: Number
    }]
}, {
    timestamps: true
});

// Indexes
vehicleSchema.index({ contractor: 1, status: 1 });
vehicleSchema.index({ vehicleNumber: 1 });

export default mongoose.model<IVehicle>('Vehicle', vehicleSchema);