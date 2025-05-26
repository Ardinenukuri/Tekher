import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/password.utils';

const JWT_SECRET = process.env.JWT_SECRET || 'ceeea2d8e605d0b45522104f3e1dfb79cfcb160c965073108a15e216f2e44e88';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }
    
    const hashedPassword = await hashPassword(password);
    const user = await UserModel.create(username, email, hashedPassword);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    const user = await UserModel.findByEmail(email);
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const user = await UserModel.findProfileById(userId);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};