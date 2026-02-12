import { Model, FilterQuery, UpdateQuery, QueryOptions, Document } from 'mongoose';

export interface IBaserepository<T extends Document> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(filter: FilterQuery<T>, options?: QueryOptions): Promise<T | null>;
  findByEmail(email: string): Promise<T | null>;
  findAll(filter: FilterQuery<T>, options: QueryOptions): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  updateMany(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<any>;
  countDocuments(): Promise<number>;
}
