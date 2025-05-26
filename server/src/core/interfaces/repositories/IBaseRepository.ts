import { Document, Model, FilterQuery, UpdateQuery } from 'mongoose';

export interface IBaseRepository<T extends Document> {
    create(item: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    findAll(filter?: FilterQuery<T>): Promise<T[]>;
    update(id: string, data: UpdateQuery<T>): Promise<T | null>;
}