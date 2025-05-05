import { IBadgeRepository } from '../core/interfaces/repositories/IBadgeRepository';
import { SafeBadge } from '../core/types/SafeBadge';
import { SafeUser } from '../core/types/SafeUser';
import { BadgeModel, IBadge } from '../models/Badge';
import { UserModel, IUserBadge } from '../models/User';
import mongoose from 'mongoose';

export class BadgeRepository implements IBadgeRepository{

  async createBadge(badgeData: Partial<IBadge>): Promise<IBadge> {
    const badge = new BadgeModel(badgeData);
    return await badge.save();
  }

  async findBadgeById(badgeId: string): Promise<IBadge | null> {
    return await BadgeModel.findById(badgeId);
  }

  async findBadgeByName(name: string): Promise<IBadge | null> {
    return await BadgeModel.findOne({ name });
  }

  async listBadge(badgeId:string):Promise<IBadge | null> {
    return await BadgeModel.findByIdAndUpdate(
      badgeId,
      { isListed: true },
      { new: true }
    );
  }

  async unlistBadge(badgeId:string):Promise<IBadge | null> {
    return await BadgeModel.findByIdAndUpdate(
      badgeId,
      { isListed: false },
      { new: true }
    );
  }

  async updateBadge(badgeId: string, updates: Partial<IBadge>): Promise<IBadge | null> {
    return await BadgeModel.findByIdAndUpdate(
      badgeId,
      { ...updates },
      { new: true }
    );
  }

  async getAllBadges(): Promise<IBadge[]> {
    return await BadgeModel.find().sort({ requiredXp: 1 });
  }

  async getAvailableBadges(userId: string): Promise<IBadge[]> {
    const user = await UserModel.findById(userId);
    if (!user || !user.badges) {
      return await BadgeModel.find({
        isListed: true
      }).sort({ requiredXp: 1 });
    }
    const acquiredBadgeIds = user.badges.map(b => b.badgeId);
    return await BadgeModel.find({
      isListed: true,
      _id: { $nin: acquiredBadgeIds }
    }).sort({ requiredXp: 1 });
  }

  async addBadgeToUser(userId: string, badgeId: string): Promise<SafeUser | null> {
    return await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          badges: {
            badgeId: new mongoose.Types.ObjectId(badgeId),
            acquiredAt: new Date()
          } as IUserBadge
        },
        currentBadge: badgeId,
      },
      { new: true }
    ).select('-password');
  }

  async updateCurrentBadge(userId: string, badgeId: string): Promise<SafeUser | null> {
    return await UserModel.findByIdAndUpdate(
      userId,
      { currentBadge: badgeId },
      { new: true }
    ).select('-password');
  }

  async getUserBadges(userId: string): Promise<SafeBadge | null> {
    const result = await UserModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'badges',
          localField: 'badges.badgeId',
          foreignField: '_id',
          as: 'populatedBadges'
        }
      },
      {
        $lookup: {
          from: 'badges',
          localField: 'currentBadge',
          foreignField: '_id',
          as: 'currentBadge'
        }
      },
      {
        $addFields: {
          badges: {
            $map: {
              input: "$badges",
              as: "badge",
              in: {
                badgeId: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$populatedBadges",
                        as: "pb",
                        cond: { $eq: ["$$pb._id", "$$badge.badgeId"] }
                      }
                    },
                    0
                  ]
                },
                acquiredAt: "$$badge.acquiredAt"
              }
            }
          },
          currentBadge: { $arrayElemAt: ["$currentBadge", 0] }
        }
      },
      {
        $project: {
          badges: 1,
          currentBadge: 1,
          _id: 0
        }
      }
    ]);
    return result[0] ?? null;
  }

}