import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';


dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: (process.env.EMAIL_PORT === '465'), 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASSWORD, 
  },
});

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.warn(
    '***************************************************\n' +
    'WARNING: Email credentials are not set in .env file.\n' +
    'Email functionality will be disabled.\n' +
    '***************************************************'
  );
}

export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('Email service is not configured. Cannot send verification email.');
    throw new Error('Email service is not configured.');
  }
  if (!process.env.FRONTEND_URL) {
    console.error('BASE_URL is not set in .env file. Cannot generate verification link.');
    throw new Error('Application base URL is not configured.');
  }

  const verificationLink = `${process.env.FRONTEND_URL}/api/auth/verify-email/${token}`;

  const mailOptions = {
    from: `"Blog Api" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome to Our App!</h2>
        <p>Thank you for registering. Please click the button below to verify your email address and activate your account.</p>
        <a href="${verificationLink}" style="background-color: #28a745; color: white; padding: 12px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
        <p>If you did not create an account, you can safely ignore this email.</p>
        <p>This verification link will expire in 10 minutes.</p>
        <hr/>
        <p style="font-size: 0.8em; color: #888;">If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
        <p style="font-size: 0.8em; color: #888;">${verificationLink}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent successfully to: ${email}`);
  } catch (error) {
    console.error(`Error sending verification email to ${email}:`, error);
    throw new Error('Failed to send verification email.');
  }
};