import { IConnection } from '../../../models/Connection';

export interface IConnectionRepository {
  followUser(followerId: string, followingId: string): Promise<IConnection | null>;
  unfollowUser(followerId: string, followingId: string): Promise<void>;
  getFollowers(userId: string): Promise<IConnection[] | null>;
  getFollowerCount(userId: string): Promise<number>;
  getFlollowingCount(userId:string):Promise<number>
  getFollowing(userId: string ): Promise<IConnection[] | null>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
}