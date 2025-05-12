import { FilterQuery } from 'mongoose';
import Subscription , {ISubscription } from '../models/subscription.model.js';

export const SubscriptionRepository = {
  create: async (subscriptionData: Partial<ISubscription>): Promise<ISubscription> => {
    return await Subscription.create(subscriptionData);
  },

  findAll: async (filter: Partial<ISubscription> = {}): Promise<ISubscription[]> => {
    return await Subscription.find(filter as FilterQuery<ISubscription>)
      .populate('millOwnerId')
      .populate('planId');
  },

  findById: async (id: string): Promise<ISubscription | null> => {
    return await Subscription.findById(id)
      .populate('millOwnerId')
      .populate('planId');
  },

  findByMillOwner: async (millOwnerId: string): Promise<ISubscription[]> => {
    return await Subscription.find({ millOwnerId })
      .populate('planId')
      .sort({ createdAt: -1 });
  },

  update: async (id: string, subscriptionData: Partial<ISubscription>): Promise<ISubscription | null> => {
    return await Subscription.findByIdAndUpdate(id, subscriptionData, { new: true })
      .populate('millOwnerId')
      .populate('planId');
  },

  delete: async (id: string): Promise<ISubscription | null> => {
    return await Subscription.findByIdAndDelete(id);
  },

  findActive: async (): Promise<ISubscription[]> => {
    return await Subscription.find({ status: 'active' })
      .populate('millOwnerId')
      .populate('planId');
  },

  findExpiring: async (days: number): Promise<ISubscription[]> => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    
    return await Subscription.find({
      status: 'active',
      endDate: { $lte: expiryDate },
    })
      .populate('millOwnerId')
      .populate('planId');
  },
};