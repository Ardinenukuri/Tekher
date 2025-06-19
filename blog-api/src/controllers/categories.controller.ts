import { Request, Response, NextFunction } from 'express';
import pool from '../config/db';

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query('SELECT id, name FROM categories ORDER BY name ASC');
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};