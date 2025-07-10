import { Document, Model, FilterQuery, UpdateQuery } from 'mongoose';
import { IBaseRepository } from '../core/interfaces/repositories/IBaseRepository';

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async create(item: Partial<T>): Promise<T> {
        return await this.model.create(item);
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id);
    }

    async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
        return this.model.find(filter);
    }

    async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        return this.model.findOne(filter);
    }

    async deleteOne(filter: FilterQuery<T>): Promise<void> {
        await this.model.deleteOne(filter);
    }

}
