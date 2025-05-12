import express from 'express';
import { SubscriptionController } from '../controllers/subscription.controller.js';

const router = express.Router();

// Admin routes
router.post('/', SubscriptionController.createSubscription);
router.get('/', SubscriptionController.getAllSubscriptions);
router.get('/:id', SubscriptionController.getSubscriptionById);
router.put('/:id', SubscriptionController.updateSubscription);
router.post('/:id/cancel', SubscriptionController.cancelSubscription);
router.post('/:id/renew', SubscriptionController.renewSubscription);

// Mill owner routes
router.get('/mill-owner/:millOwnerId', SubscriptionController.getMillOwnerSubscriptions);

export default router;