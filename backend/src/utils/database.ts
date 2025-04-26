import mongoose from "mongoose";
import logger from "./logger.js";
import appConfigs from "./config.js";

let isDatabaseConnected = false;

export const connectToDatabase = async (): Promise<void> => {
    if (isDatabaseConnected) {
        logger.info("Database is already connected.");
        return;
    }
    try {
        logger.warn("Attempting to connect to the database...");
        await mongoose.connect(appConfigs.MONGO_URL);
        isDatabaseConnected = true;
        logger.success("Database connected successfully.");
    } catch (error) {
        logger.error("Failed to connect to the database.", error);
        throw error;
    }
};