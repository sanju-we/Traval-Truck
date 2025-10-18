import { logger } from '../utils/logger.js';
export class RepositoryError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RepositoryError';
    }
}
export class BaseRepository {
    #model;
    constructor(model) {
        this.#model = model;
        logger.debug(`BaseRepository initialized for model ${model.modelName}`);
    }
    async create(data) {
        try {
            const newItem = new this.#model(data);
            logger.info(`new User ${newItem}`);
            const savedItem = await newItem.save();
            logger.info(`Created document in ${this.#model.modelName} with ID ${savedItem._id}`);
            return savedItem;
        }
        catch (err) {
            logger.error(`Failed to create document in ${this.#model.modelName}: ${err.message}`);
            throw new RepositoryError(`Failed to create document: ${err.message}`);
        }
    }
    async findById(id) {
        try {
            const item = await this.#model.findById(id).exec();
            logger.debug(`Queried ${this.#model.modelName} by ID ${id}: ${item ? 'found' : 'not found'}`);
            logger.info(`data that got ${item}`);
            return item;
        }
        catch (err) {
            logger.error(`Failed to find document in ${this.#model.modelName} by ID ${id}: ${err.message}`);
            throw new RepositoryError(`Failed to find document: ${err.message}`);
        }
    }
    async findOne(filter) {
        try {
            const item = await this.#model.findOne(filter).exec();
            logger.debug(`Queried ${this.#model.modelName} with filter ${JSON.stringify(filter)}: ${item ? 'found' : 'not found'}`);
            return item;
        }
        catch (err) {
            logger.error(`Failed to find document in ${this.#model.modelName}: ${err.message}`);
            throw new RepositoryError(`Failed to find document: ${err.message}`);
        }
    }
    async findByEmail(email) {
        try {
            const item = await this.#model.findOne({ email }).exec();
            return item;
        }
        catch (err) {
            logger.error(`Failed to find document in ${this.#model.modelName}: ${err.message}`);
            throw new RepositoryError(`Failed to find document: ${err.message}`);
        }
    }
    async findAllUser(filter = {}, options = {}) {
        try {
            const items = await this.#model.find(filter, null, options).exec();
            logger.debug(`Found ${items.length} documents in ${this.#model.modelName} with filter ${JSON.stringify(filter)}`);
            return items;
        }
        catch (err) {
            logger.error(`Failed to find documents in ${this.#model.modelName}: ${err.message}`);
            throw new RepositoryError(`Failed to find documents: ${err.message}`);
        }
    }
    async update(id, data) {
        try {
            const item = await this.#model.findByIdAndUpdate(id, data, { new: true }).exec();
            logger.info(`Updated document in ${this.#model.modelName} with ID ${id}: ${item ? 'success' : 'not found'}`);
            return item;
        }
        catch (err) {
            logger.error(`Failed to update document in ${this.#model.modelName} with ID ${id}: ${err.message}`);
            throw new RepositoryError(`Failed to update document: ${err.message}`);
        }
    }
}
