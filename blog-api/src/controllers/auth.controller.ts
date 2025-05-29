import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { generateResetToken, sendResetEmail } from '../utils/passwordReset';
import pool from '../config/db';
import { generateOTP, sendVerificationEmail } from '../utils/emailVerification';
import {
  registerSchema,
  verifyEmailSchema,
  loginSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
} from '../schemas/auth.schema';
import { handleZodError } from '../utils/errors';
import { ZodError } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'ceeea2d8e605d0b45522104f3e1dfb79cfcb160c965073108a15e216f2e44e88';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = registerSchema.parse(req.body);
    const { username, email, password, role } = parsed;

    const userRole = role === 'admin' ? 'user' : role || 'user';

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }

    const otp = generateOTP();
    const tokenExpires = new Date(Date.now() + 600000);

    const hashedPassword = await hashPassword(password);
    const user = await UserModel.create({
      username,
      email,
      password_hash: hashedPassword,
      role: role as 'admin' | 'moderator' | 'user',
      is_verified: false,
      verification_token: otp,
      token_expires: tokenExpires,
    });

    await sendVerificationEmail(email, otp);

    res.status(201).json({
      message: 'Verification OTP sent to email',
      userId: user.id,
    });
  } catch (error: unknown) {
  if (error instanceof ZodError) {
    res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
  } else {
    console.error('Registration failed:', error);
    res.status(500).json({ message: 'Registration error' });
  }
}
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = verifyEmailSchema.parse(req.body);
    const { email, otp } = parsed;

    const user = await UserModel.findByEmail(email);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.is_verified) {
      res.status(400).json({ message: 'Email already verified' });
      return;
    }

    if (user.verification_token !== otp) {
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }

    if (user.token_expires < new Date()) {
      res.status(400).json({ message: 'OTP expired' });
      return;
    }

    // Optionally update verification fields
    // await UserModel.update(user.id, {
    //   is_verified: true,
    //   verification_token: null,
    //   token_expires: null,
    // });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Email verified successfully',
      token,
    });
  } catch (error: unknown) {
  if (error instanceof ZodError) {
    res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
  } else {
    console.error('validatio error:', error);
    res.status(500).json({ message: 'validation failed' });
  }

  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = loginSchema.parse(req.body);
    const { email, password } = parsed;

    const user = await UserModel.findByEmail(email);
    if (!user || !(await comparePassword(password, user.password_hash))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error: unknown) {
  if (error instanceof ZodError) {
    res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
  } else {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
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

export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = passwordResetRequestSchema.parse(req.body);
    const { email } = parsed;

    const user = await UserModel.findByEmail(email);
    if (!user) {
      res.status(200).json({ message: 'Email not found' });
      return;
    }

    const token = generateResetToken();
    const expires = new Date(Date.now() + 3600000);

    await UserModel.setResetToken(email, token, expires);
    await sendResetEmail(email, token);

    res.json({ message: 'Reset link sent to email' });
  } catch (error: unknown) {
  if (error instanceof ZodError) {
    res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
  } else {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = passwordResetSchema.parse(req.body);
    const { token, newPassword } = parsed;

    const user = await UserModel.findByResetToken(token);
    if (!user) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }

    const hashedPassword = await hashPassword(newPassword);

    await pool.query('BEGIN');
    try {
      await UserModel.updatePassword(user.id, hashedPassword);
      await pool.query(
        `UPDATE users 
         SET reset_token = NULL, 
             reset_token_expires = NULL 
         WHERE id = $1`,
        [user.id]
      );
      await pool.query('COMMIT');
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }

    res.json({ message: 'Password updated successfully' });
  } catch (error: unknown) {
  if (error instanceof ZodError) {
    res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
  } else {
    console.error('password update failed:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
};
