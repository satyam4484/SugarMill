import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ERROR_MESSAGES } from '../utils/constants.js';
import config from '../utils/config.js';
import User from '../models/user.model.js';
import Mill from '../models/mill.model.js';
import Contractor from '../models/contractor.model.js';
import { UserRole } from '../utils/constants.js';

export interface AuthRequest extends Request {
    user?: any;
    mill?: any;
    contractor: any;
}

export const authenticateToken = async (req: any, res: Response, next: NextFunction) => {
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
        if(user.role === UserRole.MILL_OWNER){
            req.mill = await Mill.findOne({user:user._id})
        }else if (user.role === UserRole.CONTRACTOR){
            console.log("contractor")
            req.contractor = await Contractor.findOne({user:user._id})
            console.log("contract---",req.contractor)
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: ERROR_MESSAGES.INVALID_TOKEN });
    }
};