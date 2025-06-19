import { Request, Response, NextFunction } from 'express';

export const authorizeSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user && user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Forbidden: Super admin access required.' });
  }
};