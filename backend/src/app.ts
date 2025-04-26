import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './utils/config.js';
import logger from './utils/logger.js';
import appRoutes from './routes/index.routes.js';
// Import routes
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api',appRoutes)

export default app;