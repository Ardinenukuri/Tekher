import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Generate OTP
export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

// Send verification email
export const sendVerificationEmail = async (email: string, otp: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify Your Email',
    html: `
      <h2>Email Verification</h2>
      <p>Your verification code is: <strong>${otp}</strong></p>
      <p>This code expires in 10 minutes.</p>
    `
  });
};