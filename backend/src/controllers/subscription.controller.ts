import { Request, Response } from 'express';
import { SubscriptionRepository } from '../repositories/subscription.repository.js';
import { HTTP_STATUS_CODE } from '../utils/constants.js';

export const SubscriptionController = {
  createSubscription: async (req: Request, res: Response) => {
    try {
      const subscription = await SubscriptionRepository.create(req.body);
      return res.status(HTTP_STATUS_CODE.CREATED).json({
        status: 'success',
        data: subscription,
      });
    } catch (error: any) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: 'error',
        message: error.message,
      });
    }
  },

  getAllSubscriptions: async (req: Request, res: Response) => {
    try {
      const subscriptions = await SubscriptionRepository.findAll();
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: 'success',
        data: subscriptions,
      });
    } catch (error: any) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message,
      });
    }
  },

  getSubscriptionById: async (req: Request, res: Response) => {
    try {
      const subscription = await SubscriptionRepository.findById(req.params.id);
      if (!subscription) {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
          status: 'error',
          message: 'Subscription not found',
        });
      }
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: 'success',
        data: subscription,
      });
    } catch (error: any) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message,
      });
    }
  },

  getMillOwnerSubscriptions: async (req: Request, res: Response) => {
    try {
      const subscriptions = await SubscriptionRepository.findByMillOwner(req.params.millOwnerId);
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: 'success',
        data: subscriptions,
      });
    } catch (error: any) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message,
      });
    }
  },

  updateSubscription: async (req: Request, res: Response) => {
    try {
      const subscription = await SubscriptionRepository.update(req.params.id, req.body);
      if (!subscription) {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
          status: 'error',
          message: 'Subscription not found',
        });
      }
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: 'success',
        data: subscription,
      });
    } catch (error: any) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message,
      });
    }
  },

  cancelSubscription: async (req: Request, res: Response) => {
    try {
      const subscription = await SubscriptionRepository.update(req.params.id, {
        status: 'expired',
        autoRenew: false,
      });
      if (!subscription) {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
          status: 'error',
          message: 'Subscription not found',
        });
      }
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: 'success',
        data: subscription,
      });
    } catch (error: any) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message,
      });
    }
  },

  renewSubscription: async (req: Request, res: Response) => {
    try {
      const subscription = await SubscriptionRepository.findById(req.params.id);
      if (!subscription) {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
          status: 'error',
          message: 'Subscription not found',
        });
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);

      const renewedSubscription = await SubscriptionRepository.update(req.params.id, {
        status: 'active',
        startDate,
        endDate,
        lastBillingDate: startDate,
        nextBillingDate: endDate,
      });

      return res.status(HTTP_STATUS_CODE.OK).json({
        status: 'success',
        data: renewedSubscription,
      });
    } catch (error: any) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message,
      });
    }
  },
};