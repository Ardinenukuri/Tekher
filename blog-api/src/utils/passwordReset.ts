import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,       
    pass: process.env.EMAIL_PASSWORD, 
  },
});

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.warn('WARNING: Email service credentials are not configured in your .env file. Password reset emails cannot be sent.');
}


export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex'); 
};


export const sendResetEmail = async (email: string, token: string): Promise<void> => {
  const frontendUrl = process.env.FRONTED_URL;

  if (!frontendUrl) {
    console.error('CRITICAL: FRONTEND_URL is not set in the .env file. Cannot create reset link.');
    throw new Error('Application frontend URL is not configured.');
  }

  const resetLink = `${frontendUrl}/auth/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Blog API" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
        <h2 style="color: #4f46e5;">Password Reset Request</h2>
        <p>We received a request to reset the password for your account associated with this email address.</p>
        <p>Please click the button below to set a new password. This link is valid for 1 hour.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a 
            href="${resetLink}" 
            style="background-color: #4f46e5; color: white; padding: 14px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;"
          >
            Reset Your Password
          </a>
        </div>
        <p>If you did not request a password reset, please ignore this email. Your password will not be changed.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 0.8em; color: #888;">
          If you're having trouble clicking the button, copy and paste this URL into your browser:
          <br>
          <a href="${resetLink}" style="color: #4f46e5;">${resetLink}</a>
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to: ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email.');
  }
};