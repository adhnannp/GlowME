import { injectable, inject } from 'inversify';
import { ICoinPlanRepository } from '../../core/interfaces/repositories/ICoinPlanRepository';
import { ICoinPlan } from '../../models/CoinPlan';
import { TYPES } from '../../di/types';
import { IAdminCoinPlanService } from '../../core/interfaces/services/admin/IAdmin.CoinPlan.Service';
import { CreateCoinPlanValidation, UpdateCoinPlanSchema } from '../../validators/coinPlanValidation';

@injectable()
export class AdminCoinPlanService implements IAdminCoinPlanService {
  constructor(
    @inject(TYPES.CoinPlanRepository) private coinPlanRepository: ICoinPlanRepository
  ) {}

  async createPlan(data: Partial<ICoinPlan>): Promise<ICoinPlan> {
    const validationResult = CreateCoinPlanValidation.safeParse(data);
    if (!validationResult.success) {
      throw new Error(validationResult.error.errors[0].message);
    }
    const validatedData = validationResult.data;
    if (validatedData.title && (await this.coinPlanRepository.getCoinPlanByTitle(validatedData.title))) {
      throw new Error('Coin plan title already exists');
    }
    const coinPlan = await this.coinPlanRepository.createCoinPlan(validatedData);
    if (!coinPlan) throw new Error('Failed to create coin plan');
    return coinPlan;
  }

  async getAllPlans(): Promise<ICoinPlan[] | null> {
    return await this.coinPlanRepository.getAllPlans();
  }

  async updatePlan(id: string, data: Partial<ICoinPlan>): Promise<ICoinPlan> {
    const validationResult = UpdateCoinPlanSchema.safeParse(data);
    if (!validationResult.success) {
      throw new Error(validationResult.error.errors[0].message);
    }
    const validatedData = validationResult.data;
    const coinPlan = await this.coinPlanRepository.getCoinPlanById(id);
    if (!coinPlan) throw new Error('Coin plan not found');
    const isUnchanged =
      (validatedData.title === undefined || validatedData.title === coinPlan.title) &&
      (validatedData.coins === undefined || validatedData.coins === coinPlan.coins) &&
      (validatedData.price === undefined || validatedData.price === coinPlan.price);
    if (isUnchanged) {
      return coinPlan;
    }
    const updates: Partial<ICoinPlan> = {};
    if (validatedData.title && validatedData.title !== coinPlan.title) {
      if (await this.coinPlanRepository.getCoinPlanByTitle(validatedData.title)) {
        throw new Error('Coin plan title already exists');
      }
      updates.title = validatedData.title;
    }
    if (validatedData.coins !== undefined && validatedData.coins !== coinPlan.coins) {
      updates.coins = validatedData.coins;
    }
    if (validatedData.price !== undefined && validatedData.price !== coinPlan.price) {
      updates.price = validatedData.price;
    }
    const updatedPlan = await this.coinPlanRepository.updateCoinPlan(id, updates);
    if (!updatedPlan) throw new Error('Failed to update coin plan');
    return updatedPlan;
  }

  async listPlan(id: string): Promise<ICoinPlan> {
    const coinPlan = await this.coinPlanRepository.getCoinPlanById(id);
    if (!coinPlan || coinPlan.isListed) {
      throw new Error('Coin plan not found or already listed');
    }
    const listedPlan = await this.coinPlanRepository.listPlan(id);
    if (!listedPlan) throw new Error('Failed to list the coin plan');
    return listedPlan;
  }

  async unlistPlan(id: string): Promise<ICoinPlan> {
    const coinPlan = await this.coinPlanRepository.getCoinPlanById(id);
    if (!coinPlan || !coinPlan.isListed) {
      throw new Error('Coin plan not found or already unlisted');
    }
    const unlistedPlan = await this.coinPlanRepository.unlistPlan(id);
    if (!unlistedPlan) throw new Error('Failed to unlist the coin plan');
    return unlistedPlan;
  }

}