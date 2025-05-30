import { Router } from "express";
import authRoutes from './auth.routes.js';
import contractorRoutes from './contractor.routes.js'; 
import labourRoutes from './labour.routes.js'
import millRoutes from './mill.routes.js'
import customerRoutes from './customer.routes.js'
import documentRoutes from './document.routes.js';
import userRoutes from './user.routes.js';
import contractRouter from './contract.routes.js';
import vechicleRoutes from './vehicle.routes.js'
import planRoutes from './plan.routes.js';
import subsriptionRoutes from './subscription.routes.js'
import invoiceRoutes from './invoice.routes.js';


const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/contractors', contractorRoutes); 
router.use('/labours',labourRoutes)
router.use('/mill',millRoutes)
router.use('/customers',customerRoutes)
router.use('/documents',documentRoutes)
router.use('/contracts',contractRouter)
router.use('/vehicles',vechicleRoutes)
router.use('/plans',planRoutes)
router.use('/subsriptions',subsriptionRoutes)
router.use('/invoices',invoiceRoutes)

export default router;