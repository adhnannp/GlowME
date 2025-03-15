export interface IOTPService {
    generateOTP(): string;
    sendOTP(email: string, otp: string): Promise<void>;
    verifyOTP(email: string, otp: string): Promise<boolean>;
  }