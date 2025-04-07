import { IUser } from '../../../../models/User';

export interface IAdminService {
    getAdminByEmail(email:string): Promise<Partial<IUser>| null>;
}