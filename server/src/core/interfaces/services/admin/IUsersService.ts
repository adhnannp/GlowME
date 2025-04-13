import { SafeUser } from "../../../types/SafeUser";

export interface IUsersService {
    getUser(skip:number,limit:number): Promise<[SafeUser[],number] | null>;
}