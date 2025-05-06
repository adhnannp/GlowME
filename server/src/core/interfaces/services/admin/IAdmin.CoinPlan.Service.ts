import { ICoinPlan } from "../../../../models/CoinPlan";

export interface IAdminCoinPlanService{
    createPlan(data: Partial<ICoinPlan>): Promise<ICoinPlan>;
    getAllPlans(): Promise<ICoinPlan[] | null>;
    updatePlan(id: string, data: Partial<ICoinPlan>): Promise<ICoinPlan>;
    listPlan(id: string): Promise<ICoinPlan>
    unlistPlan(id: string): Promise<ICoinPlan>
}