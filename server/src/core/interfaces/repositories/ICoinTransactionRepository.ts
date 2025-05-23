import { ICoinTransaction } from "../../../models/CoinTransaction";
import { CoinTransactionCreateInput } from "../../types/CreateCoinTransaction";

export default interface ICoinTransactionRepository{
    create(input: CoinTransactionCreateInput): Promise<ICoinTransaction> ;
    getById(transactionId: string): Promise<ICoinTransaction | null>;
    getAll(page: number, limit: number): Promise<ICoinTransaction[]>;
    findByStripeIntentId(intentId: string): Promise<ICoinTransaction | null>;
    getByUserId( userId: string,page: number,limit: number ): Promise<{transactions:ICoinTransaction[];total:number}>;
}