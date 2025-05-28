import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';
import user from '../types/express'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticate = async (
  req: Request, 
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number, role?: string };
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    // Type-safe user attachment
    req.user = {userId: user.id, role: user.role || 'user'  };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Not authorized' });
  }
};