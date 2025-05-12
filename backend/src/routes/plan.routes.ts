import express from 'express';
import { PlanController } from '../controllers/plan.controller.js';

const router = express.Router();

// Public routes
router.get('/active', PlanController.getActivePlans);


router.post('/', PlanController.createPlan);
router.get('/', PlanController.getAllPlans);
router.get('/:id', PlanController.getPlanById);
router.put('/:id', PlanController.updatePlan);
router.delete('/:id', PlanController.deletePlan);

export default router;