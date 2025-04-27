import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ERROR_MESSAGES } from '../utils/constants.js';
import config from '../utils/config.js';
import User from '../models/user.model.js';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
        }
        const decoded = jwt.verify(token, config.JWT_SECRET) as any;
        const user = await User.findOne({userId:decoded.userId});
        if (!user) {
            return res.status(401).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: ERROR_MESSAGES.INVALID_TOKEN });
    }
};