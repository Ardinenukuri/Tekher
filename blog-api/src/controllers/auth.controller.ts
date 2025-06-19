import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { generateResetToken, sendResetEmail } from '../utils/passwordReset';
import pool from '../config/db';
import { generateVerificationToken, sendVerificationEmail } from '../utils/emailVerification';
import {
  registerSchema,
  verifyEmailSchema,
  loginSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
} from '../schemas/auth.schema';
import { handleZodError } from '../utils/errors';
import { ZodError } from 'zod';
import { processImage } from '../utils/imageUploader';

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

    const verificationToken = generateVerificationToken();
    const tokenExpires = new Date(Date.now() + 600000);

    const hashedPassword = await hashPassword(password);
    const user = await UserModel.create({
      username,
      email,
      password_hash: hashedPassword,
      role: role as 'admin' | 'moderator' | 'user',
      is_verified: false,
      verification_token: verificationToken,
      token_expires: tokenExpires,
    });

    await sendVerificationEmail(email, verificationToken);

    console.log(`Verification link for ${email}: ${process.env.BASE_URL}/api/auth/verify-email/${verificationToken}`);

    res.status(201).json({
      message: 'Verification link sent to your email. Please check your inbox.',
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
    const { token } = req.params;

    const user = await UserModel.findByVerificationToken(token); 

    if (!user) {
      res.status(400).send('<h1>Verification Failed</h1><p>This verification link is invalid or has expired.</p>');
      return;
    }
    
    if (user.token_expires && user.token_expires < new Date()) {
      res.status(400).send('<h1>Verification Failed</h1><p>This verification link has expired.</p>');
      return;
    }

    await UserModel.update(user.id, {
      is_verified: true,
      verification_token: null, 
      token_expires: null,
    });

    res.status(200).send('<h1>Email Verified Successfully!</h1><p>You can now close this tab and log in to your account.</p>');

  } catch (error: unknown) {
    console.error('Email verification error:', error);
    res.status(500).send('<h1>Error</h1><p>An unexpected error occurred during verification.</p>');
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = loginSchema.parse(req.body);
    const { email, password } = parsed;
    const user = await UserModel.findByEmail(email);

    if (!user || !(await comparePassword(password, user.password_hash))) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const payload = {
      userId: user.id,
      role: user.role 
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }); 

    res.status(200).json({
      success: true,
      token: token,
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error: unknown) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
    } else {
      console.error('Login error:', error);
      res.status(500).json({ message: 'An internal server error occurred' });
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
    
    if (user) {
      const token = generateResetToken();
      const expires = new Date(Date.now() + 3600000); 

      await UserModel.setResetToken(email, token, expires);
      
      await sendResetEmail(email, token);

      const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;
      console.log('******************************************');
      console.log('PASSWORD RESET LINK (FOR DEV TESTING):');
      console.log(resetLink);
      console.log('******************************************');
      }
    res.json({ message: 'If an account with that email exists, a reset link has been sent.' });

  } catch (error) {
    
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


export const updateUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let uploadedFile: Express.Multer.File | undefined;
    try {
      uploadedFile = await processImage(req);
    } catch (fileError: any) {
      res.status(400).json({ success: false, message: fileError.message });
      return;
    }

    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }


    const { name, email } = req.body;

    const updateFields: string[] = [];
    const queryParams: (string | number)[] = [];
    let paramIndex = 1;

    if (name) {
      updateFields.push(`username = $${paramIndex++}`);
      queryParams.push(name);
    }
    if (email) {
      updateFields.push(`email = $${paramIndex++}`);
      queryParams.push(email);
    }
    if (uploadedFile) {
      updateFields.push(`avatar_url = $${paramIndex++}`);
      queryParams.push(uploadedFile.filename); 
    }

    if (updateFields.length === 0) {
      res.status(400).json({ success: false, message: 'No fields to update provided.' });
      return;
    }

    queryParams.push(userId);
    
    const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramIndex}
      RETURNING id, username, email, avatar_url;
    `;

    const result = await pool.query(updateQuery, queryParams);
    
    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: result.rows[0],
    });

  } catch (err) {
    if ((err as any).code === '23505') {
        res.status(409).json({ success: false, message: 'This email address is already in use.' });
        return;
    }
    next(err);
  }
};