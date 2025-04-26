
import mongoose from "mongoose";
import logger from "./utils/logger.js";
import appConfigs from "./utils/config.js";
import app from "./app.js";

logger.info("Starting the application...")

const connectToDatabase = async ():Promise<void> => {
    try {
        logger.warn("Attempting to connect to the database...");
        await mongoose.connect(appConfigs.MONGO_URL);
        logger.success("Database connected successfully.");
    } catch (error) {
        logger.error("Failed to connect to the database.", error);
        throw error;
    }
};

const startServer = ():void => {
    app.listen(appConfigs.PORT, () : void => {
        logger.info(`Server is running and listening on port ${appConfigs.PORT}`);
    });
};

const initializeApp = async () : Promise<void> => {
    try {
        // await connectToDatabase();
        startServer();
        logger.success("Application started successfully.");
    } catch (error) {
        logger.error("Application startup failed.", error);
    }
};

initializeApp();

export default app;