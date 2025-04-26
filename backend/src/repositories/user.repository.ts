import logger from "@/utils/logger.js";// Assuming you have a logger utility
import User ,{ UserType} from "@/models/user.model.js";
// Assuming you have a User model defined in your models directory



export const getAllUsers = async (): Promise<UserType[]> => {
    try {
        logger.info('Fetching all users from the database');
        // Replace the following line with actual database logic
        const users = await User.find(); // Assuming you're using an ORM like Mongoose or Sequelize
        logger.info(`Successfully fetched ${users.length} users`);
        return users;
    } catch (error) {
        logger.error('Error fetching all users:', error);
        throw new Error('Error fetching all users');
    }
};

export const getUserById = async (id: string): Promise<UserType | null> => {
    try {
        logger.info(`Fetching user with ID: ${id}`);
        // Replace the following line with actual database logic
        const user = await User.findById(id); // Assuming you're using an ORM like Mongoose
        if (user) {
            logger.info(`Successfully fetched user with ID: ${id}`);
        } else {
            logger.warn(`User with ID: ${id} not found`);
        }
        return user;
    } catch (error) {
        logger.error(`Error fetching user with ID: ${id}`, error);
        throw new Error('Error fetching user by ID');
    }
};