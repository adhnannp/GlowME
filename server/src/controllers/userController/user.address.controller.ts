import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../di/types";
import { STATUS_CODES } from "../../utils/HTTPStatusCode";
import { MESSAGES } from "../../utils/ResponseMessages";
import IUserAddressController from "../../core/interfaces/controllers/user/IUser.Address.Controller";
import { IUserAddressService } from "../../core/interfaces/services/user/IUser.Address.Service";

@injectable()
export class UserAddressController implements IUserAddressController {
  constructor(
    @inject(TYPES.UserAddressService) private addressService: IUserAddressService,
  ) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const userId = req.userId;
    if (!userId) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.USER_NOT_AUTHENTICATED });
      return;
    }
    const address = await this.addressService.getAllAddress(userId);
    res.status(STATUS_CODES.OK).json({ address, message: MESSAGES.REWARD_FETCHED });
  }

  async create(req: Request, res: Response): Promise<void> {
    const userId = req.userId;
    if (!userId) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.USER_NOT_AUTHENTICATED });
      return;
    }
    const data = { ...req.body, user_id: userId };
    const address = await this.addressService.createAddress(data);
    res.status(STATUS_CODES.CREATED).json({ address, message: MESSAGES.ADDRESS_CREATED });
  }


  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!id) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.ADDRESS_ID_REQUIRED });
      return;
    }
    const address = await this.addressService.updateAddress(id, req.body);
    res.status(STATUS_CODES.OK).json({ address, message: MESSAGES.ADDRESS_UPDATED });
  }
  
}
