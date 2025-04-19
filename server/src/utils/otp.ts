import nodemailer from 'nodemailer';

export const generateOTP = (): string => {
  const min = 100000;
  const max = 999999;
  return `${Math.floor(Math.random() * (max - min + 1)) + min}`;
};



export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP is ${otp}`,
  });
};

export const sendResetEmail = async (email: string, resetLink: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  try {
    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>You requested to reset your password. Click the button below to set a new password:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
          <p>This link will expire in 10 hour for security reasons.</p>
          <p>If you didn’t request a password reset, please ignore this email or contact support.</p>
          <p>Best regards,<br>Your App Team</p>
        </div>
      `,
      text: `
        You requested to reset your password. Copy and paste this link to set a new password:
        ${resetLink}
        This link will expire in 1 hour for security reasons.
        If you didn’t request a password reset, please ignore this email or contact support.
        Best regards,
        Your App Team
      `,
    });
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw new Error('Failed to send reset email');
  }
};