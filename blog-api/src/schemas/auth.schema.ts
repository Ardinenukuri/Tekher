import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,254}$/;
const nameRegex = /^[A-Za-z\s]+$/;

export const registerSchema = z.object({
  username: z
    .string()
    .min(5, 'Username must be at least 5 characters')
    .max(100, 'Username must be less than 100 characters')
    .regex(nameRegex, 'Username can only contain letters and spaces'),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(254, 'Password must be less than 255 characters')
    .regex(
      passwordRegex,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  role: z.string().optional(),
});

export const verifyEmailSchema = z.object({
  email: z.string().email('Invalid email'),
  otp: z.string().min(4, 'OTP is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email('Invalid email'),
});

export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(254, 'Password must be less than 255 characters')
    .regex(
      passwordRegex,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
});
