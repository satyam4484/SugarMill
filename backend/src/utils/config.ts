import dotenv from "dotenv";
dotenv.config();
import logger from "./logger.js";

logger.info("Reading Environment Variables...");
// make types

interface AppConfigs {
    PORT: number;
    MONGO_URL: string;
}

const appConfigs: AppConfigs = {
    PORT: parseInt(process.env.PORT ?? "3000", 10),
    MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/myapp",
};

logger.success("Environment variables read successfully.")


export default appConfigs;