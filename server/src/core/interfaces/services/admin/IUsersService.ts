import { SafeUser } from "../../../tpes/SafeUser";

export interface IUsersService {
    getUser(skip:number): Promise<[SafeUser[],number] | null>;
}