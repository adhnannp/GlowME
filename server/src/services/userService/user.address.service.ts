import { IUserAddressService } from '../../core/interfaces/services/user/IUser.Address.Service';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { IAddressRepository } from '../../core/interfaces/repositories/IAddressRepository';
import { IAddress } from '../../models/Address';

@injectable()
export class UserAddressService implements IUserAddressService {
    constructor(
        @inject(TYPES.AddressRepository) private addressRepo: IAddressRepository,
    ) {}

    async findOneById(id: string): Promise<IAddress | null> {
        return this.addressRepo.findById(id);
    }

    async getAllAddress(userId:string): Promise<IAddress[]> {
        return this.addressRepo.findAll({user_id:userId});
    }

    async deleteOne(id:string):Promise<void>{
        await this.addressRepo.deleteOne({_id:id});
    }

}
