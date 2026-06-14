// src/core/repositories/BaseRepository.ts
import { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import { logger } from '../utils/logger';
import { IBaserepository } from '../core/interface/repositorie/IBaseRepositories';

export class RepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RepositoryError';
  }
}

export class BaseRepository<T extends Document> implements IBaserepository<T> {
  #model: Model<T>;

  constructor(model: Model<T>) {
    this.#model = model;
    logger.debug(`BaseRepository initialized for model ${model.modelName}`);
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const newItem = new this.#model(data);
      logger.info(`new User ${newItem}`);
      const savedItem = await newItem.save();
      logger.info(`Created document in ${this.#model.modelName} with ID ${savedItem._id}`);
      return savedItem;
    } catch (err) {
      const error = err as Error;
      logger.error(`Failed to create document in ${this.#model.modelName}: ${error.message}`);
      throw new RepositoryError(`Failed to create document: ${error.message}`);
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      const item = await this.#model.findById(id).exec();
      return item;
    } catch (err) {
      const error = err as Error;
      logger.error(
        `Failed to find document in ${this.#model.modelName} by ID ${id}: ${error.message}`,
      );
      throw new RepositoryError(`Failed to find document: ${error.message}`);
    }
  }

  async findOne(filter: FilterQuery<T>, options?: QueryOptions): Promise<T | null> {
    try {
      const query = this.#model.findOne(filter);
      if (options) {
        query.setOptions(options);
      }
      const item = await query.exec();
      logger.debug(
        `Queried ${this.#model.modelName} with filter ${JSON.stringify(filter)}: ${item ? 'found' : 'not found'}`,
      );
      return item;
    } catch (err) {
      const error = err as Error;
      logger.error(`Failed to find document in ${this.#model.modelName}: ${error.message}`);
      throw new RepositoryError(`Failed to find document: ${error.message}`);
    }
  }

  async findByEmail(email: string): Promise<T | null> {
    try {
      const item = await this.#model.findOne({ email }).exec();
      return item;
    } catch (err) {
      const error = err as Error;
      logger.error(`Failed to find document in ${this.#model.modelName}: ${error.message}`);
      throw new RepositoryError(`Failed to find document: ${error.message}`);
    }
  }

  async findAll(filter: FilterQuery<T> = {}, options: QueryOptions = {}): Promise<T[]> {
    try {
      const items = await this.#model.find(filter, null, options).exec();
      logger.debug(
        `Found ${items.length} documents in ${this.#model.modelName} with filter ${JSON.stringify(filter)}`,
      );
      return items;
    } catch (err) {
      const error = err as Error;
      logger.error(`Failed to find documents in ${this.#model.modelName}: ${error.message}`);
      throw new RepositoryError(`Failed to find documents: ${error.message}`);
    }
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    try {
      const item = await this.#model.findByIdAndUpdate(id, data, { new: true }).exec();
      logger.info(
        `Updated document in ${this.#model.modelName} with ID ${id}: ${item ? 'success' : 'not found'}`,
      );
      return item;
    } catch (err) {
      const error = err as Error;
      logger.error(
        `Failed to update document in ${this.#model.modelName} with ID ${id}: ${error.message}`,
      );
      throw new RepositoryError(`Failed to update document: ${error.message}`);
    }
  }

  async updateMany(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<unknown> {
    try {
      const result = await this.#model.updateMany(filter, data).exec();
      logger.info(`Updated multiple documents in ${this.#model.modelName} match filter ${JSON.stringify(filter)}: ${JSON.stringify(result)}`);
      return result;
    } catch (err) {
      const error = err as Error;
      logger.error(`Failed to update multiple documents in ${this.#model.modelName}: ${error.message}`);
      throw new RepositoryError(`Failed to update multiple documents: ${error.message}`);
    }
  }

  async countDocuments(filter:FilterQuery<T>): Promise<number> {
    try {
      const count = await this.#model.countDocuments(filter)
      return count
    } catch (error) {
      const err = error as Error;
      logger.error(
        `count the documents: ${err.message}`,
      );
      throw new RepositoryError(`Failed to count document: ${err.message}`);
    }
  }
}
