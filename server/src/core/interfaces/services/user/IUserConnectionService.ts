import { IConnection } from "../../../../models/Connection";
import { INotification } from "../../../../models/Notification";
import { IReport } from "../../../../models/Report";
import { IUser } from "../../../../models/User";
import { SafeUser } from "../../../types/SafeUser";


export interface IUserConnectionService {
    followUser(followerId: string, followingId: string): Promise<IConnection | null>;
    unfollowUser(followerId: string, followingId: string): Promise<void>;
    reportUser(reporterId: string, reportedId: string, reason: string): Promise<IReport | null>;
    getUsers(skip: number, limit:number,search?:string): Promise<[SafeUser[], number] | null>;
    findUserById(id: string,currentUserId:string): Promise<[Omit<IUser, "password">, number,number,boolean] | null>;
    getFollowers(userId: string): Promise<IConnection[] | null> ;
    getFollowing(userId: string): Promise<IConnection[] | null> 
  }