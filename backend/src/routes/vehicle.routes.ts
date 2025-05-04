import express from 'express';
import { VehicleController } from '../controllers/vehicle.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', VehicleController.createVehicle);
router.get('/', VehicleController.getContractorVehicles);
router.get('/:id', VehicleController.getVehicleById);
router.put('/:id/permanent', VehicleController.assignPermanently);
router.put('/:id/rent', VehicleController.rentToMill);
router.put('/:id/end-rental', VehicleController.endRental);

export default router;