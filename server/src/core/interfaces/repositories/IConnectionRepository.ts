import { IConnection } from '../../../models/Connection';

export interface IConnectionRepository {
  followUser(followerId: string, followingId: string): Promise<IConnection | null>;
  unfollowUser(followerId: string, followingId: string): Promise<void>;
  getFollowers(userId: string, skip?: number): Promise<IConnection[] | null>;
  getFollowing(userId: string, skip?: number): Promise<IConnection[] | null>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
}