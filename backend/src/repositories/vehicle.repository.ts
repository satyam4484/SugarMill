import Vehicle, { IVehicle, VehicleStatus } from '../models/vehicle.model.js';
import mongoose, { Types } from 'mongoose';
import logger from '../utils/logger.js';

export const createVehicle = async (vehicleData: Partial<IVehicle>): Promise<IVehicle> => {
    try {
        const vehicle = new Vehicle(vehicleData);
        await vehicle.save();
        return vehicle;
    } catch (error) {
        logger.error('Error creating vehicle:', error);
        throw new Error('Failed to create vehicle');
    }
};

export const getVehiclesByContractor = async (contractorId: string): Promise<IVehicle[]> => {
    try {
        return await Vehicle.find({ contractor: contractorId })
            .populate('contractor')
            .populate('currentRental.mill');
    } catch (error) {
        logger.error('Error fetching contractor vehicles:', error);
        throw new Error('Failed to fetch vehicles');
    }
};

export const assignVehiclePermanently = async (vehicleId: string): Promise<IVehicle> => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(
            vehicleId,
            { 
                status: VehicleStatus.PERMANENT,
                $unset: { currentRental: 1 }
            },
            { new: true }
        );
        if (!vehicle) throw new Error('Vehicle not found');
        return vehicle;
    } catch (error) {
        logger.error('Error assigning vehicle permanently:', error);
        throw new Error('Failed to assign vehicle');
    }
};

export const rentVehicleToMill = async (
    vehicleId: string,
    millId: string,
    startDate: Date,
    endDate: Date,
    rentalRate: number
): Promise<IVehicle> => {
    try {
        const rental = {
            mill: new Types.ObjectId(millId),
            startDate,
            endDate,
            rentalRate
        };

        const vehicle = await Vehicle.findByIdAndUpdate(
            vehicleId,
            {
                status: VehicleStatus.RENTED,
                currentRental: rental,
                $push: { rentalHistory: rental }
            },
            { new: true }
        );

        if (!vehicle) throw new Error('Vehicle not found');
        return vehicle;
    } catch (error) {
        logger.error('Error renting vehicle:', error);
        throw new Error('Failed to rent vehicle');
    }
};

export const endVehicleRental = async (vehicleId: string): Promise<IVehicle> => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(
            vehicleId,
            {
                status: VehicleStatus.AVAILABLE,
                $unset: { currentRental: 1 }
            },
            { new: true }
        );
        if (!vehicle) throw new Error('Vehicle not found');
        return vehicle;
    } catch (error) {
        logger.error('Error ending vehicle rental:', error);
        throw new Error('Failed to end rental');
    }
};

export const getVehicleById = async (id: string): Promise<IVehicle | null> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn(`Invalid vehicle ID format: ${id}`);
            return null;
        }

        const vehicle = await Vehicle.findById(id)
            .populate('contractor')
            .populate({
                path: 'currentRental',
                populate:'mill',
            }).populate('rentalHistory.mill');
        console.log(vehicle);

        if (!vehicle) {
            logger.warn(`Vehicle with ID: ${id} not found`);
        }
        return vehicle;
    } catch (error) {
        logger.error(`Error getting vehicle with ID: ${id}`, error);
        throw new Error('Error getting vehicle details');
    }
};