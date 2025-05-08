import { ICoinPlan } from "../../../../models/CoinPlan";

export default interface IUserCoinPlanService{
    getPlans(): Promise<ICoinPlan[] | null>;
    createCoinPlanCheckoutSession(userId: string,planId: string): Promise<{ sessionId: string }>;
}