import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IAuthService } from '../../core/interfaces/services/auth/IAuthService';
import { setRefreshTokens } from '../../utils/setRefreshToken';
import { IAuthController } from '../../core/interfaces/controllers/auth/IAuthController';
import { TYPES } from '../../di/types';
import { STATUS_CODES } from '../../utils/HTTPStatusCode';
import { MESSAGES } from '../../utils/ResponseMessages';

@injectable()
export class AuthController implements IAuthController{
  constructor(@inject(TYPES.AuthService) private authService: IAuthService) {}

  async register(req: Request, res: Response) {
    const user = req.body;
    try {
      const newUser = await this.authService.register(user);
      res.status(STATUS_CODES.CREATED).json({message:MESSAGES.REGISTER_SUCCESS,user:{newUser}});
      return
    } catch (error) {
      const err = error as Error
      res.status(STATUS_CODES.BAD_REQUEST).json({message:err.message})
      return
    }
  }

  async verifyOTP(req: Request, res: Response) {
    try {
        const { email, otp } = req.body;
        const data = await this.authService.verifyOTP(email, otp);
        if (!data || typeof data !== "object") {
            res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.OTP_VERIFY_FAILED });
            return
        }
        const { accessToken, refreshToken } = data;
        setRefreshTokens(res, refreshToken);
        res.status(STATUS_CODES.OK).json({ message: MESSAGES.OTP_VERIFY_SUCCESS, accessToken });
        return
    } catch (error) {
        console.error("Error in verifyOTP Controller:", error);
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: (error as Error).message || MESSAGES.OTP_VERIFY_FAILED  });
        return
    }
  }

  
  async resendOTP(req: Request, res: Response){
    try {
      const {email} = req.body
      await this.authService.resendOTP(email)
      res.status(STATUS_CODES.OK).json({message:MESSAGES.OTP_RESEND_SUCCESS});
      return
    } catch (err) {
      const error = err as Error
      if (error.message.includes("expired") || error.message.includes("does not exist")) {
        res.status(STATUS_CODES.GONE).json({ message: MESSAGES.OTP_RESEND_EXPIRED });
        return
      } else if (error.message.includes("Redis")) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.OTP_RESEND_REDIS_ISSUE });
        return
      }else if(error.message.includes("resent")){
        res.status(STATUS_CODES.BAD_REQUEST).json({ message:error.message });
        return
      }else {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.OTP_RESEND_FAILED });
        return
      }
    }
  }
  
  async loginUser(req: Request, res: Response):Promise<void>{
    try {
      const { email, password } = req.body;
      const data = await this.authService.loginUser(email, password);
      if (!data || typeof data !== "object") {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.USER_NOT_FOUND });
          return
      }

      const { accessToken, refreshToken } = data;
      setRefreshTokens(res,refreshToken)
      res.status(STATUS_CODES.OK).json({ message: MESSAGES.LOGIN_SUCCESS,accessToken });
      return
    } catch (error) {
        const err = error as Error
        res.status(STATUS_CODES.BAD_REQUEST).json({ message:err.message });
        return
    }
  }

  async loginAdmin(req: Request, res: Response):Promise<void>{
    try {
      const { email, password } = req.body;
      const data = await this.authService.loginAdmin(email, password);
      if (!data || typeof data !== "object") {
          res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.LOGIN_FAILED });
          return
      }
      const { accessToken, refreshToken } = data;
      setRefreshTokens(res,refreshToken)
      res.status(STATUS_CODES.OK).json({ message: MESSAGES.LOGIN_SUCCESS,accessToken });
      return
    } catch (error) {
        const err = error as Error
        res.status(STATUS_CODES.BAD_REQUEST).json({ message:err.message });
        return
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('refreshToken');
    res.status(STATUS_CODES.OK).json({ message: MESSAGES.LOGOUT_SUCCESS });
    return
  }

  async refreshToken(req: Request, res: Response) {
    const cookieRefreshToken = req.cookies.refreshToken;
    if (!cookieRefreshToken) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.REFRESH_TOKEN_MISSING });
      return
    }
    try {
      const {accessToken,refreshToken} = await this.authService.refreshToken(cookieRefreshToken);
      if (!refreshToken || !accessToken) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.REFRESH_TOKEN_FAILED });
        return
    }
      setRefreshTokens(res,refreshToken)
      res.status(STATUS_CODES.OK).json({ message: MESSAGES.REFRESH_TOKEN_SUCCESS,accessToken});
      return
    } catch (error) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.REFRESH_TOKEN_INVALID });
      return
    }
  }

  async verifyUser(req:Request,res:Response){
    const userId = req.userId
    if(!userId){
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.VERIFY_USER_MISSING });
      return;
    }
    try {
      const userData = await this.authService.verifyUser(userId)
      if(!userData){
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_TOKEN });  
        return;
      }
      res.status(STATUS_CODES.OK).json({message:MESSAGES.VERIFY_USER_SUCCESS,user:userData});
      return;
    } catch (error) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_TOKEN });
      return;
    }
  }
}