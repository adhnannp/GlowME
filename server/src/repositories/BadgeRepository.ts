import { BadgeModel, IBadge } from '../models/Badge';
import { UserModel, IUser, IUserBadge } from '../models/User';
import mongoose from 'mongoose';

export class AdminBadgeRepository {
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

  async updateBadge(badgeId: string, updates: Partial<IBadge>): Promise<IBadge | null> {
    return await BadgeModel.findByIdAndUpdate(
      badgeId,
      { ...updates, updated_at: new Date() },
      { new: true }
    );
  }

  async getAllBadges(): Promise<IBadge[]> {
    return await BadgeModel.find().sort({ requiredXp: 1 });
  }
}

export class UserBadgeRepository {
  async findUserById(userId: string): Promise<IUser | null> {
    return await UserModel.findById(userId);
  }

  async getAvailableBadges(userId: string): Promise<IBadge[]> {
    const user = await UserModel.findById(userId);
    if (!user || !user.badges) return [];
    const acquiredBadgeIds = user.badges.map(b => b.badgeId);
    return await BadgeModel.find({
      isListed: true,
      _id: { $nin: acquiredBadgeIds }
    }).sort({ requiredXp: 1 });
  }

  async addBadgeToUser(userId: string, badgeId: string): Promise<IUser | null> {
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
        edited_at: new Date()
      },
      { new: true }
    );
  }

  async updateCurrentBadge(userId: string, badgeId: string): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(
      userId,
      { currentBadge: badgeId, edited_at: new Date() },
      { new: true }
    );
  }

  async getUserBadges(userId: string): Promise<IUser | null> {
    return await UserModel.findById(userId).populate('badges.badgeId currentBadge');
  }
}