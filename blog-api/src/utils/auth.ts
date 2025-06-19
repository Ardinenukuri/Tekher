import { Request } from 'express';
import jwt from 'jsonwebtoken';

export const getUserIdFromToken = (req: Request): number | null => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      return decoded.userId || null;
    }
    return null;
  } catch (error) {
    return null;
  }
};