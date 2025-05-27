import { Request, Response } from 'express';
import UserModel from '../models/user.model';
import pool from '../config/db';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserModel.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const promoteToAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body;
    
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ message: 'Requires admin privileges' });
      return;
    }

    const { rowCount } = await pool.query(
      `UPDATE users SET role = 'admin' WHERE id = $1 RETURNING id, email`,
      [userId]
    );

    if (rowCount === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'User promoted to admin successfully' });
  } catch (error) {
    console.error('Promotion error:', error);
    res.status(500).json({ message: 'Failed to promote user' });
  }
};