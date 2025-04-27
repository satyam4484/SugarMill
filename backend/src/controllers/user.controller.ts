import { Request, Response } from 'express';
import * as UserRepository from '../repositories/user.repository.js';
import logger from '../utils/logger.js';

export class UserController {
    static async checkExistingUser(req: Request, res: Response): Promise<Response> {
        try {
            const { email, contactNo } = req.body;
            
            if (!email && !contactNo) {
                return res.status(400).json({
                    success: false,
                    message: 'Either email or contact number is required'
                });
            }

            const result = await UserRepository.checkExistingUser(email, contactNo);
            return res.status(200).json({
                success: !result.isError,
                message: result.message
            });
        } catch (error) {
            logger.error('Error checking existing user:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error while checking user details'
            });
        }
    }
}

export const userController = new UserController();