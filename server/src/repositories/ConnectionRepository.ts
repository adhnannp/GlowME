// src/repositories/ConnectionRepository.ts
import { injectable } from 'inversify';
import { IConnectionRepository } from '../core/interfaces/repositories/IConnectionRepository';
import { ConnectionModel } from '../models/Connection';
import { IConnection } from '../models/Connection';

@injectable()
export class ConnectionRepository implements IConnectionRepository {
  async followUser(followerId: string, followingId: string): Promise<IConnection | any> {
    return await ConnectionModel.create({
      follower: followerId,
      following: followingId
    });
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    await ConnectionModel.deleteOne({
      follower: followerId,
      following: followingId
    });
  }

  async getFollowerCount(userId: string): Promise<number> {
    return await ConnectionModel.countDocuments({ following: userId });
  }

  async getFollowers(userId: string, skip: number = 0): Promise<IConnection[] | null> {
    return await ConnectionModel.find({ following: userId })
      .populate('follower', '-password')
      .skip(skip)
      .limit(10)
      .lean();
  }

  async getFollowing(userId: string, skip: number = 0): Promise<IConnection[] | null> {
    return await ConnectionModel.find({ follower: userId })
      .populate('following', '-password')
      .skip(skip)
      .limit(10)
      .lean();
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const connection = await ConnectionModel.findOne({
      follower: followerId,
      following: followingId
    });
    return !!connection;
  }
}