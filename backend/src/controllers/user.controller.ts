import { Request, Response } from 'express';
import logger from '../utils/logger.js';
import { getUser, getAllUsers } from  '../repositories/user.repository.js'; // Adjust the import path as necessary

export class UserController {
    // Get all users
    async getAllUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users = await getAllUsers();
            return res.status(200).json(users);
        } catch (error) {
            logger.error('Error fetching users:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // Get user by ID
    async getUserById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const user = await getUser({_id:id});

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json(user);
        } catch (error) {
            logger.error('Error fetching user:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export const userController = new UserController();