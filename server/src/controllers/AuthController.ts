import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IAuthService } from '../core/interfaces/services/IAuthService';
import { setRefreshTokens } from '../utils/setRefreshToken';
import { IAuthController } from '../core/interfaces/controllers/IAuthController';
import { TYPES } from '../di/types';

@injectable()
export class AuthController implements IAuthController{
  constructor(@inject(TYPES.AuthService) private authService: IAuthService) {}

  async register(req: Request, res: Response) {
    const user = req.body;
    try {
      const newUser = await this.authService.register(user);
      res.status(201).json({message:"registered successfully please check your email for OTP",user:{newUser}});
    } catch (error) {
      res.status(400).json({message:"Registration failed"})
    }
  }

  async verifyOTP(req: Request, res: Response) {
    try {
        const { email, otp } = req.body;
        const data = await this.authService.verifyOTP(email, otp);
        if (!data || typeof data !== "object") {
            res.status(400).json({ message: "OTP verification failed" });
            return
        }
        const { accessToken, refreshToken } = data;
        setRefreshTokens(res, refreshToken);
        res.status(200).json({ message: "OTP verified successfully", accessToken });
    } catch (error) {
        console.error("Error in verifyOTP Controller:", error);
        res.status(400).json({ message: (error as Error).message || "OTP verification failed." });
    }
  }

  
  async resendOTP(req: Request, res: Response){
    try {
      const {email} = req.body
      await this.authService.resendOTP(email)
      res.status(200).json({message:'OTP resend successfully'});
    } catch (error:any) {
      if (error.message.includes("expired") || error.message.includes("does not exist")) {
        res.status(410).json({ message: "User data expired or not found. Please restart the verification process." });
      } else if (error.message.includes("Redis")) {
        res.status(500).json({ message: "Internal server error: Redis issue. Please try again later." });
      }else if(error.message.includes("resent")){
        res.status(400).json({ message:error.message });
      }else {
        res.status(400).json({ message: "Resend OTP failed. Please try again." });
      }
    }
  }
  
  async login(req: Request, res: Response):Promise<void>{
    try {
      const { email, password } = req.body;
      const data = await this.authService.login(email, password);
      if (!data || typeof data !== "object") {
          res.status(400).json({ message: "Login failed" });
          return
      }
      const { accessToken, refreshToken } = data;
      setRefreshTokens(res,refreshToken)
      res.status(200).json({ message: "Login successful",accessToken });
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Login Failed try again" });
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
  }

  async refreshToken(req: Request, res: Response) {
    const cookieRefreshToken = req.cookies.refreshToken;
    if (!cookieRefreshToken) {
      res.status(401).json({ message: 'No refresh token provided' });
      return
    }
    try {
      const {accessToken,refreshToken} = await this.authService.refreshToken(cookieRefreshToken);
      if (!refreshToken || !accessToken) {
        res.status(400).json({ message: "Refreshing Tokens failed" });
        return
    }
      setRefreshTokens(res,refreshToken)
      res.status(200).json({ message: 'Token refreshed',accessToken});
    } catch (error) {
      res.status(401).json({ message: 'Invalid refresh token' });
    }
  }

}