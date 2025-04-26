
import mongoose from "mongoose";
import logger from "./utils/logger.js";
import appConfigs from "./utils/config.js";
import app from "./app.js";
import { connectToDatabase } from "./utils/database.js"; // Import the database connection

logger.info("Starting the application...");

const startServer = (): void => {
    app.listen(appConfigs.PORT, () : void => {
        logger.info(`Server is running and listening on port ${appConfigs.PORT}`);
    });
};

const initializeApp = async (): Promise<void> => {
    try {
        await connectToDatabase();
        startServer();
        logger.success(`Application started successfully. http://localhost:${appConfigs.PORT}`);
    } catch (error) {
        logger.error("Application startup failed.", error);
    }
};


initializeApp();

export default app;