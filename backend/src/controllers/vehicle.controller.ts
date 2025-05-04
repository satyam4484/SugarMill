import { Request, Response } from 'express';
import * as VehicleRepository from '../repositories/vehicle.repository.js';
import logger from '../utils/logger.js';

export class VehicleController {
    static async createVehicle(req: any, res: Response): Promise<Response> {
        try {
            
            const vehicle = await VehicleRepository.createVehicle({
                ...req.body,
                contractor: req.contractor._id
            });
            return res.status(201).json(vehicle);
        } catch (error) {
            logger.error('Error in createVehicle:', error);
            return res.status(500).json({ message: 'Failed to create vehicle' });
        }
    }

    static async getContractorVehicles(req: any, res: Response): Promise<Response> {
        try {
            const vehicles = await VehicleRepository.getVehiclesByContractor(req.contractor._id);
            return res.status(200).json(vehicles);
        } catch (error) {
            logger.error('Error in getContractorVehicles:', error);
            return res.status(500).json({ message: 'Failed to fetch vehicles' });
        }
    }

    static async assignPermanently(req: Request, res: Response): Promise<Response> {
        try {
            const vehicle = await VehicleRepository.assignVehiclePermanently(req.params.id);
            return res.status(200).json(vehicle);
        } catch (error) {
            logger.error('Error in assignPermanently:', error);
            return res.status(500).json({ message: 'Failed to assign vehicle' });
        }
    }

    static async rentToMill(req: Request, res: Response): Promise<Response> {
        try {
            const { millId, startDate, endDate, rentalRate } = req.body;
            const vehicle = await VehicleRepository.rentVehicleToMill(
                req.params.id,
                millId,
                new Date(startDate),
                new Date(endDate),
                rentalRate
            );
            return res.status(200).json(vehicle);
        } catch (error) {
            logger.error('Error in rentToMill:', error);
            return res.status(500).json({ message: 'Failed to rent vehicle' });
        }
    }

    static async endRental(req: Request, res: Response): Promise<Response> {
        try {
            const vehicle = await VehicleRepository.endVehicleRental(req.params.id);
            return res.status(200).json(vehicle);
        } catch (error) {
            logger.error('Error in endRental:', error);
            return res.status(500).json({ message: 'Failed to end rental' });
        }
    }

    static async getVehicleById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const vehicle = await VehicleRepository.getVehicleById(id);
            
            if (!vehicle) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Vehicle not found' 
                });
            }
    
            return res.status(200).json({
                success: true,
                data: vehicle
            });
        } catch (error) {
            logger.error('Error in getVehicleById:', error);
            return res.status(500).json({ 
                success: false,
                message: 'Error getting vehicle details' 
            });
        }
    }
}