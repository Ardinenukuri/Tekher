
import pool from '../config/db';

// src/middlewares/role.middleware.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const requireRole = (requiredRole: string): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== requiredRole) {
      res.status(403).json({ message: `Requires ${requiredRole} role` });
      return;
    }
    next();
  };
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

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Assuming you have user data attached to req after authentication
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Requires admin role' });
  }
  next();
};