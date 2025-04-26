import dotenv from "dotenv";
dotenv.config();
import logger from "./logger.js";

logger.info("Reading Environment Variables...");

interface AppConfigs {
    PORT: number;
    MONGO_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    NODE_ENV: string;
    AWS_ACCESS_KEY_ID?: string;
    AWS_SECRET_ACCESS_KEY?: string;
    AWS_BUCKET_NAME?: string;
    AWS_REGION?: string;
}

const appConfigs: AppConfigs = {
    PORT: parseInt(process.env.PORT ?? "3000", 10),
    MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/sugar-mill",
    JWT_SECRET: process.env.JWT_SECRET || "your-super-secret-jwt-key",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
    NODE_ENV: process.env.NODE_ENV || "development",
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_REGION: process.env.AWS_REGION
};

logger.success("Environment variables read successfully.");

export default appConfigs;