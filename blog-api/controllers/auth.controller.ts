import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { generateResetToken, sendResetEmail } from '../utils/passwordReset';
import pool from '../config/db';
import { generateOTP, sendVerificationEmail } from '../utils/emailVerification';

const JWT_SECRET = process.env.JWT_SECRET || 'ceeea2d8e605d0b45522104f3e1dfb79cfcb160c965073108a15e216f2e44e88';

// src/controllers/auth.controller.ts
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;

    // Prevent self-assigning admin role
    const userRole = role === 'admin' ? 'user' : role || 'user';
    
    // Validate input
    if (!username || !email || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }

    const otp = generateOTP();
    const tokenExpires = new Date(Date.now() + 600000); // 10 minutes
    
    // Save unverified user with OTP
    const hashedPassword = await hashPassword(password);
    const user = await UserModel.create({
      userData: {
        username,
        email,
        password_hash: hashedPassword,
        role: userRole,
        is_verified: false,
        verification_token: otp,
        token_expires: tokenExpires
      }
    });

    // Send verification email
    await sendVerificationEmail(email, otp);
    
    res.status(201).json({ 
      message: 'Verification OTP sent to email',
      userId: user.id 
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;
    
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
    
    // // Mark as verified
    // await UserModel.update(user.id, { 
    //   is_verified: true,
    //   verification_token: null,
    //   token_expires: null 
    // });
    
    // Generate auth token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ 
      message: 'Email verified successfully',
      token 
    });
    
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    const user = await UserModel.findByEmail(email);
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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

// Request Password Reset
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await UserModel.findByEmail(email);

    if (!user) {
      
      res.status(200).json({ message: 'Email not found' });
      return;
    }

    const token = generateResetToken();
    const expires = new Date(Date.now() + 3600000); 

    await UserModel.setResetToken(email, token, expires);
    
    try {
      await sendResetEmail(email, token);
      res.json({ message: 'Reset link sent to email' });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      res.status(500).json({ message: 'Error sending reset email' });
    }
    
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      res.status(400).json({ message: 'Token and new password are required' });
      return;
    }

    const user = await UserModel.findByResetToken(token);
    
    if (!user) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      res.status(400).json({ message: 'Password must be at least 8 characters' });
      return;
    }

    const hashedPassword = await hashPassword(newPassword);
    
    // Update password and clear token in a transaction
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
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};
