import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Generate token 
export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex'); 
};

// Send email with nodemailer
export const sendResetEmail = async (email: string, token: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset',
    html: `
      <p>You requested a password reset. Use this token below:</p>
      <p> token= ${token}</p>
        Reset Password
      </a>
      <p>This link expires in 1 hour.</p>
    `,
  });
};