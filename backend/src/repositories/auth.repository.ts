import User, { IUser as UserType } from '../models/user.model.js';
import logger from '../utils/logger.js';

export const findUserByEmail = async (email: Partial<UserType> ): Promise<UserType | null> => {
    try {
        logger.info(`Finding user by Details: ${email}`);
        return await User.findOne({email});
    } catch (error) {
        logger.error('Error finding user by email:', error);
        throw new Error('Error finding user by email');
    }
};

export const createUser = async (userData: Partial<UserType>): Promise<UserType> => {
    try {
        logger.info('Creating new user');
        const user = new User(userData);
        await user.save();
        logger.success('User created successfully');
        return user;
    } catch (error) {
        logger.error('Error creating user:', error);
        throw new Error('Error creating user');
    }
};