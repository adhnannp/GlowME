import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IAuthService } from '../../core/interfaces/services/auth/IAuthService';
import { setRefreshTokens } from '../../utils/setRefreshToken';
import { IAuthController } from '../../core/interfaces/controllers/auth/IAuthController';
import { TYPES } from '../../di/types';

@injectable()
export class AuthController implements IAuthController{
  constructor(@inject(TYPES.AuthService) private authService: IAuthService) {}

  async register(req: Request, res: Response) {
    const user = req.body;
    try {
      const newUser = await this.authService.register(user);
      res.status(201).json({message:"registered successfully please check your email for OTP",user:{newUser}});
      return
    } catch (error) {
      const err = error as Error
      res.status(400).json({message:err.message})
      return
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
        return
    } catch (error) {
        console.error("Error in verifyOTP Controller:", error);
        res.status(400).json({ message: (error as Error).message || "OTP verification failed." });
        return
    }
  }

  
  async resendOTP(req: Request, res: Response){
    try {
      const {email} = req.body
      await this.authService.resendOTP(email)
      res.status(200).json({message:'OTP resend successfully'});
      return
    } catch (err) {
      const error = err as Error
      if (error.message.includes("expired") || error.message.includes("does not exist")) {
        res.status(410).json({ message: "User data expired or not found. Please restart the verification process." });
        return
      } else if (error.message.includes("Redis")) {
        res.status(500).json({ message: "Internal server error: Redis issue. Please try again later." });
        return
      }else if(error.message.includes("resent")){
        res.status(400).json({ message:error.message });
        return
      }else {
        res.status(400).json({ message: "Resend OTP failed. Please try again." });
        return
      }
    }
  }
  
  async loginUser(req: Request, res: Response):Promise<void>{
    try {
      const { email, password } = req.body;
      const data = await this.authService.loginUser(email, password);
      if (!data || typeof data !== "object") {
          res.status(400).json({ message: "No User Found" });
          return
      }

      const { accessToken, refreshToken } = data;
      setRefreshTokens(res,refreshToken)
      res.status(200).json({ message: "Login successful",accessToken });
      return
    } catch (error) {
        const err = error as Error
        res.status(400).json({ message:err.message });
        return
    }
  }

  async loginAdmin(req: Request, res: Response):Promise<void>{
    try {
      const { email, password } = req.body;
      const data = await this.authService.loginAdmin(email, password);
      if (!data || typeof data !== "object") {
          res.status(400).json({ message: "Login failed" });
          return
      }
      const { accessToken, refreshToken } = data;
      setRefreshTokens(res,refreshToken)
      res.status(200).json({ message: "Login successful",accessToken });
      return
    } catch (error) {
        const err = error as Error
        res.status(400).json({ message:err.message });
        return
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
    return
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
      return
    } catch (error) {
      res.status(401).json({ message: 'Invalid refresh token' });
      return
    }
  }

  async verifyUser(req:Request,res:Response){
    const userId = req.userId
    if(!userId){
      res.status(400).json({ message: 'no credentials added' });
      return;
    }
    try {
      const userData = await this.authService.verifyUser(userId)
      if(!userData){
        res.status(400).json({ message: 'Invalid token' });  
        return;
      }
      res.status(200).json({message:"got user by id successfully",user:userData});
      return;
    } catch (error) {
      res.status(400).json({ message: 'Invalid token' });
      return;
    }
  }
}