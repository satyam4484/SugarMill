import { Request, Response } from 'express';
import { PlanRepository } from '../repositories/plan.repository.js';
import { HTTP_STATUS_CODE } from '../utils/constants.js';

export const PlanController = {
  createPlan: async (req: Request, res: Response) => {
    try {
      const plan = await PlanRepository.create(req.body);
      return res.status(HTTP_STATUS_CODE.CREATED).json({
        status: 'success',
        data: plan,
      });
    } catch (error: any) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: 'error',
        message: error.message,
      });
    }
  },

  getAllPlans: async (req: Request, res: Response) => {
    try {
      const plans = await PlanRepository.findAll();
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: 'success',
        data: plans,
      });
    } catch (error: any) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message,
      });
    }
  },

  getPlanById: async (req: Request, res: Response) => {
    try {
      const plan = await PlanRepository.findById(req.params.id);
      if (!plan) {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
          status: 'error',
          message: 'Plan not found',
        });
      }
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: 'success',
        data: plan,
      });
    } catch (error: any) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message,
      });
    }
  },

  updatePlan: async (req: Request, res: Response) => {
    try {
      const plan = await PlanRepository.update(req.params.id, req.body);
      if (!plan) {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
          status: 'error',
          message: 'Plan not found',
        });
      }
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: 'success',
        data: plan,
      });
    } catch (error: any) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message,
      });
    }
  },

  deletePlan: async (req: Request, res: Response) => {
    try {
      const plan = await PlanRepository.delete(req.params.id);
      if (!plan) {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
          status: 'error',
          message: 'Plan not found',
        });
      }
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: 'success',
        message: 'Plan deleted successfully',
      });
    } catch (error: any) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message,
      });
    }
  },

  getActivePlans: async (req: Request, res: Response) => {
    try {
      const plans = await PlanRepository.findActive();
      return res.status(HTTP_STATUS_CODE.OK).json({
        status: 'success',
        data: plans,
      });
    } catch (error: any) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message,
      });
    }
  },
};