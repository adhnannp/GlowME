import { SafeUser } from "../../../tpes/SafeUser";

export interface IUsersService {
    getUser(skip:number,limit:number): Promise<[SafeUser[],number] | null>;
}