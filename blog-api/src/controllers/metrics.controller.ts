import { Request, Response, NextFunction } from 'express';
import pool from '../config/db'; 

export const getDashboardMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      postCountResult,
      userCountResult,
      commentCountResult,
      likeCountResult
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM posts'),
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM comments'),
      pool.query('SELECT COUNT(*) FROM likes') 
    ]);

    const metrics = {
      totalBlogs: parseInt(postCountResult.rows[0].count, 10),
      totalUsers: parseInt(userCountResult.rows[0].count, 10),
      totalComments: parseInt(commentCountResult.rows[0].count, 10),
      totalLikes: parseInt(likeCountResult.rows[0].count, 10),
    };

    res.status(200).json({ success: true, data: metrics });

  } catch (err) {
    next(err); 
  }
};