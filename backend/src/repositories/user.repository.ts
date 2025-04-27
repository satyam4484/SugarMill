import logger from "../utils/logger.js";// Assuming you have a logger utility
import User ,{ IUser as UserType} from "../models/user.model.js";
import { UserRole } from "../utils/constants.js";
import { FilterQuery } from "mongoose";

export const checkExistingUser = async (email?: string, contactNo?: string): Promise<any> => {
    const response: any = {
        isError: false,
        message: 'User details are unique',
        data: null
    };
    
    try {
        if (email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                response.isError = true;
                response.message = 'Email already exists';
                return response;
            }
        }

        if (contactNo) {
            const existingContact = await User.findOne({ contactNo });
            if (existingContact) {
                response.isError = true;
                response.message = 'Contact number already exists';
                return response;
            }
        }

        return response;
    } catch (error) {
        logger.error('Error checking existing user details:', error);
        response.isError = true;
        response.message = 'Error checking existing user details';
        response.data = error;
        return response;
    }
};

export const getAllUsers = async (): Promise<UserType[]> => {
    try {
        logger.info('Fetching all users from the database');
        // Replace the following line with actual database logic
        const users = await User.find(); 
        logger.info(`Successfully fetched ${users.length} users`);
        return users;
    } catch (error) {
        logger.error('Error fetching all users:', error);
        throw new Error('Error fetching all users');
    }
};

export const getUser = async (data: Partial<UserType>): Promise<UserType | null> => {
    try {
        logger.info(`Fetching user with ID: ${data}`);
        // Replace the following line with actual database logic
        const user = await User.findOne(data as FilterQuery<UserType>); // Cast data to proper Mongoose filter type
        if (user) {
            logger.info(`Successfully fetched user with ID: ${data}`);
        } else {
            logger.warn(`User with ID: ${data} not found`);
        }
        return user;
    } catch (error) {
        logger.error(`Error fetching user with ID: ${data}`, error);
        throw new Error('Error fetching user by ID');
    }
};


export const generateUniqueUserId = async (name: string, email: string, role: UserRole): Promise<string> => {
    try {
        // Get role prefix
        const rolePrefix = getRolePrefix(role);
        
        // Remove spaces and special characters from name
        const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // Get first part of email (before @)
        const emailPrefix = email.split('@')[0].toLowerCase();
        
        // Generate a timestamp-based suffix
        const timestamp = Date.now().toString(36);
        
        // Combine parts to create unique ID
        const baseUserId = `${rolePrefix}${cleanName.substring(0, 4)}${emailPrefix.substring(0, 4)}${timestamp}`;
        
        // Check if userId exists and generate a new one if needed
        let userId = baseUserId;
        let counter = 0;
        
        while (await isUserIdExists(userId)) {
            counter++;
            userId = `${baseUserId}${counter}`;
        }
        
        logger.warn(`Generated unique userId: ${userId} for user: ${name} with role: ${role}`);
        return userId;
    } catch (error) {
        logger.error('Error generating userId:', error);
        throw new Error('Failed to generate userId');
    }
};



const getRolePrefix = (role: UserRole): string => {
    switch (role) {
        case UserRole.ADMIN:
            return 'AD_';
        case UserRole.LABOURER:
            return 'LAB_';
        case UserRole.CONTRACTOR:
            return 'CON_';
        case UserRole.MILL_OWNER:
            return 'MO_';
        default:
            return 'USER_';
    }
};

const isUserIdExists = async (userId: string): Promise<boolean> => {
    try {
        const existingUser = await User.findOne({ userId });
        return !!existingUser;
    } catch (error) {
        logger.error('Error checking userId existence:', error);
        throw new Error('Failed to check userId existence');
    }
};

export const generateSecurePassword = (name: string, role: UserRole): string => {
    try {
        // Get role prefix for password
        const rolePrefix = getRolePrefix(role).replace('_', '').toLowerCase();
        
        // Clean and get first 4 chars of name
        const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 4);
        
        // Generate random special characters
        const specialChars = '@#$%&*!';
        const randomSpecialChar = specialChars[Math.floor(Math.random() * specialChars.length)];
        
        // Generate random numbers (4 digits)
        const randomNumbers = Math.floor(1000 + Math.random() * 9000);
        
        // Generate random uppercase letter
        const randomUpperCase = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        
        // Combine parts to create password
        // Format: rolePrefix + cleanName + SpecialChar + Numbers + UpperCase
        const password = `${rolePrefix}${cleanName}${randomSpecialChar}${randomNumbers}${randomUpperCase}`;
        
        logger.warn(`Generated secure password for user: ${name} with role: ${role}`);
        return password;
    } catch (error) {
        logger.error('Error generating password:', error);
        throw new Error('Failed to generate password');
    }
};