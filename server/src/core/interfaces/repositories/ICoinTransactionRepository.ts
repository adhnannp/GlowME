import { ICoinTransaction } from "../../../models/CoinTransaction";

export default interface ICoinTransactionRepository{
    create(input: ICoinTransaction): Promise<ICoinTransaction>;
    getById(transactionId: string): Promise<ICoinTransaction | null>;
    getAll(page: number, limit: number): Promise<ICoinTransaction[]>;
    getByUserId( userId: string,page: number,limit: number ): Promise<ICoinTransaction[]>;
}