import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>; // Allow any return, not just void



export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => any
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};