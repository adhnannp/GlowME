import { IAddress } from "../../../../models/Address";
import { AddressCreateInput, AddressUpdateInput } from "../../../../validators/addressValidationForm";

export interface IUserAddressService{
    findOneById(id: string): Promise<IAddress | null>
    getAllAddress(userId:string): Promise<IAddress[]>
    deleteOne(id:string):Promise<void>
    createAddress(data: AddressCreateInput): Promise<IAddress>
    updateAddress(id: string, data: Partial<AddressUpdateInput>): Promise<IAddress | null>
}