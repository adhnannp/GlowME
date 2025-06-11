import { injectable, inject } from 'inversify';
import { IConnectionRepository } from '../../core/interfaces/repositories/IConnectionRepository';
import { INotificationRepository } from '../../core/interfaces/repositories/INotificationRepository';
import { IReportRepository } from '../../core/interfaces/repositories/IReportRepository';
import { TYPES } from '../../di/types';
import { IUserConnectionService } from '../../core/interfaces/services/user/IUserConnectionService';
import { SafeUser } from '../../core/types/SafeUser';
import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';
import { IUser } from '../../models/User';
import { IConnection } from '../../models/Connection';
import { IReport } from '../../models/Report';

@injectable()
export class UserConnectionService implements IUserConnectionService {
  constructor(
    @inject(TYPES.ConnectionRepository)
    private connectionRepo: IConnectionRepository,
    // @inject(TYPES.NotificationRepository)
    // private notificationRepo: INotificationRepository,
    @inject(TYPES.ReportRepository) private reportRepo: IReportRepository,
    @inject(TYPES.UserRepository) private userRepo: IUserRepository
  ) {}

  async followUser(
    followerId: string,
    followingId: string
  ): Promise<IConnection | null> {
    if (followerId === followingId) {
      throw new Error('Cannot follow yourself');
    }

    const connection = await this.connectionRepo.followUser(
      followerId,
      followingId
    );

    // await this.notificationRepo.createNotification({
    //   user: followingId,
    //   type: "follow",
    //   message: "Someone started following you",
    //   related_user: followerId,
    // });

    return connection;
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    await this.connectionRepo.unfollowUser(followerId, followingId);
  }

  async reportUser(
    reporterId: string,
    reportedId: string,
    reason: string
  ): Promise<IReport | null> {
    const existingPendingReport = await this.reportRepo.findPendingReport(reporterId, reportedId);
    if (existingPendingReport) {
      throw new Error('A pending report already in Process.');
    }

    const report = await this.reportRepo.createReport({
      reporter: reporterId,
      reported_user: reportedId,
      reason,
    });
    return report;
  }

  async getUsers(skip: number,limit:number,search:string=''): Promise<[SafeUser[], number] | null> {
    if (skip < 0) {
      return null;
    }
    const users = await this.userRepo.getAllUser(skip, limit,search);
    const TotalUsers = await this.userRepo.totalUser(search);
    if (!users) return null;
    return [users, TotalUsers];
  }

  async findUserById(id: string,currentUserId:string): Promise<[Omit<IUser, 'password'>, number,number,boolean] | null> {
    const user = await this.userRepo.findUserById(id);
    if (!user ) return null;
    const followerCount = await this.connectionRepo.getFollowerCount(id);
    const followingCount = await this.connectionRepo.getFlollowingCount(id);
    const isFollowing = await this.connectionRepo.isFollowing(currentUserId,id);
    return [user, followerCount,followingCount,isFollowing];
  }

  async getFollowers(userId: string): Promise<IConnection[] | null> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      const followers = await this.connectionRepo.getFollowers(userId);
      return followers;
    } catch (error) {
      throw new Error(`${(error as Error).message}`);
    }
  }

  async getFollowing(userId: string): Promise<IConnection[] | null> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      const following = await this.connectionRepo.getFollowing(userId);
      return following;
    } catch (error) {
      throw new Error(`${(error as Error).message}`);
    }
  }

}
