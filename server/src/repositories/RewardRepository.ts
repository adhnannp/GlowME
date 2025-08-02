import { BaseRepository } from './BaseRepository';
import { IRewardRepository } from '../core/interfaces/repositories/IRewardRepository';
import { IReward } from '../models/Reward';
import { Reward } from '../models/Reward';

export class RewardRepository extends BaseRepository<IReward> implements IRewardRepository {
  constructor() {
    super(Reward);
  }

}
