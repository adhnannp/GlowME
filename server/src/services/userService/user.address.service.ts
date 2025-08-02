import { injectable, inject } from "inversify";
import { TYPES } from "../../di/types";
import { IAddressRepository } from "../../core/interfaces/repositories/IAddressRepository";
import { IAddress } from "../../models/Address";
import { IUserAddressService } from "../../core/interfaces/services/user/IUser.Address.Service";
import { AddressCreateInput, AddressSchema, AddressUpdateInput, AddressUpdateSchema } from "../../validators/addressValidationForm";
import { HttpError } from "../../utils/HttpError";
import { STATUS_CODES } from "../../utils/HTTPStatusCode";

@injectable()
export class UserAddressService implements IUserAddressService {
  constructor(
    @inject(TYPES.AddressRepository) private addressRepo: IAddressRepository,
  ) {}

  async findOneById(id: string): Promise<IAddress | null> {
    return this.addressRepo.findById(id);
  }

  async getAllAddress(userId: string): Promise<IAddress[]> {
    return this.addressRepo.findAll({ user_id: userId });
  }

  async createAddress(data: AddressCreateInput): Promise<IAddress> {
    const parsed = AddressSchema.safeParse(data);
    if (!parsed.success) {
      throw new HttpError(STATUS_CODES.BAD_REQUEST,parsed.error.errors.map(e => e.message).join(", "));
    }
    return this.addressRepo.create(parsed.data);
  }

  async updateAddress(id: string, data: Partial<AddressUpdateInput>): Promise<IAddress | null> {
    const parsed = AddressUpdateSchema.partial().safeParse(data);
    if (!parsed.success) {
      throw new HttpError(STATUS_CODES.BAD_REQUEST,parsed.error.errors.map(e => e.message).join(", "));
    }
    return this.addressRepo.update(id,parsed.data);
  }

  async deleteOne(id: string): Promise<void> {
    await this.addressRepo.deleteOne({ _id: id });
  }
  
}
