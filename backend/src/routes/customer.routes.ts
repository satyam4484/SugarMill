import { Router } from 'express';
import {CustomerController} from '../controllers/customer.controller.js';

const router = Router();

router.post('/', CustomerController.createCustomerRequest);
router.get('/', CustomerController.getCustomerRequests);

// Add more routes as needed (e.g., PUT, DELETE)

export default router;