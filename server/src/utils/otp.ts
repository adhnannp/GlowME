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