import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser, } from '../repositories/auth.repository.js';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, UserRole, VerificationStatus } from '../utils/constants.js';
import logger from '../utils/logger.js';
import { generateUniqueUserId, generateSecurePassword, getUser } from '../repositories/user.repository.js';
import Labour from '../models/labour.model.js';
import Mill from '../models/mill.model.js';
import Contractor from '../models/contractor.model.js';
import appConfigs from '../utils/config.js';

export class AuthController {
    static async register(req: Request, res: Response): Promise<any> {
        logger.info('Processing user registration');
        const response: any = {
            success: false,
            message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
            data: undefined
        };
        try {
            const { email } = req.body;
            const existingUser = await findUserByEmail(email);
            if (existingUser) {
                logger.warn(`Registration failed: Email ${email} already exists`);
                response.success = false;
                response.message = ERROR_MESSAGES.DUPLICATE_EMAIL;
                return res.status(400).json(response);
            }

            const {name, role } = req.body;

            logger.info('Generating new UserId based on the details provided');
            const userId = await generateUniqueUserId(name, email, role);

            // write function to generate password for user
            const password = generateSecurePassword(name, role);

            logger.info('User id and password generate generaed successfully  ', userId);

            // Create new user
            const user = await createUser({
                userId,
                email,
                passwordHash: password,
                name,
                role: role
            });


            // once user is registered baesed on it's role created detals.
            logger.info('Creating user details based on the role -- ',role);
            if (role === UserRole.LABOURER) {
                const contractor = new Labour({
                  user: user._id,
                    ...req.body[role]
                });

                await contractor.save();
                logger.success(`User registered successfully with the role : ${role}`);

                response.success = true;
                response.message = SUCCESS_MESSAGES.USER_CREATED;
                response.data = {
                    userId,
                    password
                }
                return res.status(201).json(response);
            } else if(role === UserRole.MILL_OWNER){
                const mill = new Mill({
                    user: user._id,
                    ...req.body[role]
                })
                await mill.save();
                logger.success(`User registered successfully with the role : ${role}`);
                response.success = true;
                response.message = SUCCESS_MESSAGES.USER_CREATED;
                response.data = {
                    userId,
                    password
                }
                return res.status(201).json(response);
            }else if(role === UserRole.CONTRACTOR){
                const supervisor = new Contractor({
                  user: user._id,
                   ...req.body[role]
                })
                await supervisor.save();
                logger.success(`User registered successfully with the role : ${role}`);
                response.success = true;
                response.message = SUCCESS_MESSAGES.USER_CREATED;
                response.data = {
                    userId,
                    password
                }
                return res.status(201).json(response);
            }
            logger.success(`User registered successfully: ${email}`);
            response.success = true;
            response.message = SUCCESS_MESSAGES.USER_CREATED;
            response.data = {
                userId,
                password
            }
            return res.status(201).json(response);
        } catch (error) {
            logger.error('Registration error:', error);
            response.success = false;
            response.message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
            return res.status(500).json(response);
        }
    }

    static async login(req: Request, res: Response): Promise<Response> {
        logger.info('Processing user login');
        const response: any = {
            success: false,
            message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
            data: undefined
        };
    
        try {
            const { userId, password } = req.body;
    
            // Find user by userId
            const user = await getUser({userId})
            if (!user) {
                logger.warn(`Login failed: User not found with userId ${userId}`);
                response.message = ERROR_MESSAGES.INVALID_CREDENTIALS;
                return res.status(401).json(response);
            }
    
            // Verify password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                logger.warn(`Login failed: Invalid password for user ${userId}`);
                response.message = ERROR_MESSAGES.INVALID_CREDENTIALS;
                return res.status(401).json(response);
            }

            logger.info("password validation done---")
    
            // Generate JWT token
            const token = jwt.sign({ userId: user.userId }, appConfigs.JWT_SECRET,);
            console.log("token--",token)
    
            logger.success(`User logged in successfully: ${userId}`);
            response.success = true;
            response.message = SUCCESS_MESSAGES.LOGIN_SUCCESS;
            response.data = {
                token,
                user: {
                    userId: user.userId,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified
                }
            };
            return res.status(200).json(response);
        } catch (error) {
            logger.error('Login error:', error);
            return res.status(500).json(response);
        }
    }
    
    
    static async logout(req: Request, res: Response): Promise<Response> {
        logger.info('Processing user logout');
        try {
            return res.status(200).json({
                success: true,
                message: SUCCESS_MESSAGES.LOGIN_SUCCESS
            });
        } catch (error) {
            logger.error('Logout error:', error);
            return res.status(500).json({
                success: false,
                message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
            });
        }
    }
    
}
