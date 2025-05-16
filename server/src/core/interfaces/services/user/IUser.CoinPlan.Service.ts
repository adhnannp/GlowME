import { ICoinPlan } from "../../../../models/CoinPlan";
import { ICoinTransaction } from "../../../../models/CoinTransaction";
import { SafeUser } from "../../../types/SafeUser";

export default interface IUserCoinPlanService{
    getPlans(): Promise<ICoinPlan[] | null>;
    createCoinPlanCheckoutSession(userId: string,planId: string): Promise<{ sessionId: string }>;
    getCheckoutSessionDetails(sessionId: string): Promise<{transactionData: ICoinTransaction;updatedUser: SafeUser | null;}>}