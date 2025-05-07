import { injectable } from 'inversify';
import { ICoinPlanRepository } from '../core/interfaces/repositories/ICoinPlanRepository';
import { CoinPlanModel, ICoinPlan } from '../models/CoinPlan';

@injectable()
export class CoinPlanRepository implements ICoinPlanRepository{

  async createCoinPlan(data: Partial<ICoinPlan>): Promise<ICoinPlan> {
    const plan = new CoinPlanModel(data);
    return await plan.save();
  }

  async getCoinPlanById(id:string): Promise<ICoinPlan | null>{
    return await CoinPlanModel.findById(id);
  }

  async getCoinPlanByTitle(title:string): Promise<ICoinPlan | null>{
    return await CoinPlanModel.findOne({title});
  }

  async getListedPlans(): Promise<ICoinPlan[]> {
    return await CoinPlanModel.find({ isListed: true }).sort({ coins: -1 });
  }

  async getAllPlans(): Promise<ICoinPlan[]> {
    return await CoinPlanModel.find().sort({ created_at: -1 });
  }

  async updateCoinPlan(id: string, data: Partial<ICoinPlan>): Promise<ICoinPlan | null> {
    return await CoinPlanModel.findByIdAndUpdate(id, data, { new: true });
  }

  async unlistPlan(id: string): Promise<ICoinPlan | null> {
    return await CoinPlanModel.findByIdAndUpdate(id, { isListed: false }, { new: true });
  }

  async listPlan(id: string): Promise<ICoinPlan | null> {
    return await CoinPlanModel.findByIdAndUpdate(id, { isListed: true }, { new: true });
  }

}
