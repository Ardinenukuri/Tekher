import jwt from 'jsonwebtoken';
import { User } from '../modals/User';

export interface VerifyPayload {
  userId: number;
  email: string;
}

// Define this once at the top and use it consistently
const JWT_SECRET = process.env.JWT_SECRET || 'your_strong_fallback_secret_here';

export function generateJWT(user: User): string {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email, 
      name: user.name,
      role: user.role
    },
    JWT_SECRET, // Use the constant here
    { expiresIn: '1h' }
  );
}

export const generateResetToken = (email: string): string => {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' });
};

export function generateVerifyToken(payload: VerifyPayload): string {
  return jwt.sign(
    { userId: payload.userId, email: payload.email },
    JWT_SECRET, // Use the constant here
    { expiresIn: '24h' }
  );
}

export function verifyVerifyToken(token: string): VerifyPayload {
  return jwt.verify(token, JWT_SECRET) as VerifyPayload; // Use the constant here
}