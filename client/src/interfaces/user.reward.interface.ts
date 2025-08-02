export default interface IReward{
    _id:string;
    name: string;
    coverImage?: string;
    description?: string;
    coin: number;
    createdAt: Date;
    updatedAt: Date;
    isListed: boolean;
}