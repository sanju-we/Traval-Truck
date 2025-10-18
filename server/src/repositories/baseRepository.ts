// src/core/repositories/BaseRepository.ts
import { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import { logger } from '../utils/logger.js';
import { IBaserepository } from '../core/interface/repositorie/IBaseRepositories.js';

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
    } catch (err: any) {
      logger.error(`Failed to create document in ${this.#model.modelName}: ${err.message}`);
      throw new RepositoryError(`Failed to create document: ${err.message}`);
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      const item = await this.#model.findById(id).exec();
      logger.debug(`Queried ${this.#model.modelName} by ID ${id}: ${item ? 'found' : 'not found'}`);
      logger.info(`data that got ${item}`);
      return item;
    } catch (err: any) {
      logger.error(
        `Failed to find document in ${this.#model.modelName} by ID ${id}: ${err.message}`,
      );
      throw new RepositoryError(`Failed to find document: ${err.message}`);
    }
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      const item = await this.#model.findOne(filter).exec();
      logger.debug(
        `Queried ${this.#model.modelName} with filter ${JSON.stringify(filter)}: ${item ? 'found' : 'not found'}`,
      );
      return item;
    } catch (err: any) {
      logger.error(`Failed to find document in ${this.#model.modelName}: ${err.message}`);
      throw new RepositoryError(`Failed to find document: ${err.message}`);
    }
  }

  async findByEmail(email: string): Promise<T | null> {
    try {
      const item = await this.#model.findOne({ email }).exec();
      return item;
    } catch (err: any) {
      logger.error(`Failed to find document in ${this.#model.modelName}: ${err.message}`);
      throw new RepositoryError(`Failed to find document: ${err.message}`);
    }
  }

  async findAllUser(filter: FilterQuery<T> = {}, options: QueryOptions = {}): Promise<T[]> {
    try {
      const items = await this.#model.find(filter, null, options).exec();
      logger.debug(
        `Found ${items.length} documents in ${this.#model.modelName} with filter ${JSON.stringify(filter)}`,
      );
      return items;
    } catch (err: any) {
      logger.error(`Failed to find documents in ${this.#model.modelName}: ${err.message}`);
      throw new RepositoryError(`Failed to find documents: ${err.message}`);
    }
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    try {
      const item = await this.#model.findByIdAndUpdate(id, data, { new: true }).exec();
      logger.info(
        `Updated document in ${this.#model.modelName} with ID ${id}: ${item ? 'success' : 'not found'}`,
      );
      return item;
    } catch (err: any) {
      logger.error(
        `Failed to update document in ${this.#model.modelName} with ID ${id}: ${err.message}`,
      );
      throw new RepositoryError(`Failed to update document: ${err.message}`);
    }
  }
}
