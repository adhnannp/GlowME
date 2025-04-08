import { IConnection } from "../../../../models/Connection";
import { INotification } from "../../../../models/Notification";
import { IReport } from "../../../../models/Report";
import { IUser } from "../../../../models/User";
import { SafeUser } from "../../../tpes/SafeUser";


export interface IUserConnectionService {
    followUser(followerId: string, followingId: string): Promise<IConnection | null>;
    unfollowUser(followerId: string, followingId: string): Promise<void>;
    reportUser(reporterId: string, reportedId: string, reason: string): Promise<IReport | null>;
    getUsers(skip: number, limit:number): Promise<[SafeUser[], number] | null>;
    findUserById(id: string): Promise<Omit<IUser, "password"> | null>;
  }