import { Router } from "express";
import authRoutes from './auth.routes.js';
import contractorRoutes from './contractor.routes.js'; 
import labourRoutes from './labour.routes.js'
import millRoutes from './mill.routes.js'
import customerRoutes from './customer.routes.js'

const router = Router();

router.use('/auth', authRoutes);
router.use('/contractors', contractorRoutes); 
router.use('/labour',labourRoutes)
router.use('/mill',millRoutes)
router.use('/customers',customerRoutes)

export default router;