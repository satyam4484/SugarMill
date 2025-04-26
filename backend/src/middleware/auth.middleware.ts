import { Request, Response, NextFunction } from 'express';
import logger from '@/utils/logger.js';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // TODO: Replace with actual token verification logic
        if (token !== 'demo-token') {
            throw new Error('Invalid token');
        }

        // Add user information to the request object if needed
        (req as any).user = { id: '123', name: 'Demo User' }; // Assign user information

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

export default authMiddleware;