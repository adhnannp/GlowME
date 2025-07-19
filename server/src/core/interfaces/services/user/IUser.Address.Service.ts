import { IAddress } from "../../../../models/Address";

export interface IUserAddressService{
    findOneById(id: string): Promise<IAddress | null>
    getAllAddress(userId:string): Promise<IAddress[]>
    deleteOne(id:string):Promise<void>
}