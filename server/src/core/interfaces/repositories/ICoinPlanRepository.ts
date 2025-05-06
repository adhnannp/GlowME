import { ICoinPlan } from '../../../models/CoinPlan';

export interface ICoinPlanRepository{
    createCoinPlan(data: Partial<ICoinPlan>): Promise<ICoinPlan>;
    getCoinPlanById(id:string): Promise<ICoinPlan | null>;
    getCoinPlanByTitle(title:string): Promise<ICoinPlan | null>;
    getListedPlans(): Promise<ICoinPlan[]>;
    getAllPlans(): Promise<ICoinPlan[]>;
    updateCoinPlan(id: string, data: Partial<ICoinPlan>): Promise<ICoinPlan | null>;
    unlistPlan(id: string): Promise<ICoinPlan | null>;
    listPlan(id: string): Promise<ICoinPlan | null>;
}