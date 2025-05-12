import { FilterQuery } from 'mongoose';
import Plan, { IPlan } from '../models/plan.model.js';

export const PlanRepository = {
  create: async (planData: Partial<IPlan>): Promise<IPlan> => {
    return await Plan.create(planData);
  },

  findAll: async (filter: Partial<IPlan> = {}): Promise<IPlan[]> => {
    return await Plan.find(filter as FilterQuery<IPlan>);
  },

  findById: async (id: string): Promise<IPlan | null> => {
    return await Plan.findById(id);
  },

  update: async (id: string, planData: Partial<IPlan>): Promise<IPlan | null> => {
    return await Plan.findByIdAndUpdate(id, planData, { new: true });
  },

  delete: async (id: string): Promise<IPlan | null> => {
    return await Plan.findByIdAndDelete(id);
  },

  findActive: async (): Promise<IPlan[]> => {
    return await Plan.find({ isActive: true });
  },
};