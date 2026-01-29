"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BaseRepository_model;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = exports.RepositoryError = void 0;
const logger_1 = require("../utils/logger");
class RepositoryError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RepositoryError';
    }
}
exports.RepositoryError = RepositoryError;
class BaseRepository {
    constructor(model) {
        _BaseRepository_model.set(this, void 0);
        __classPrivateFieldSet(this, _BaseRepository_model, model, "f");
        logger_1.logger.debug(`BaseRepository initialized for model ${model.modelName}`);
    }
    async create(data) {
        try {
            const newItem = new (__classPrivateFieldGet(this, _BaseRepository_model, "f"))(data);
            logger_1.logger.info(`new User ${newItem}`);
            const savedItem = await newItem.save();
            logger_1.logger.info(`Created document in ${__classPrivateFieldGet(this, _BaseRepository_model, "f").modelName} with ID ${savedItem._id}`);
            return savedItem;
        }
        catch (err) {
            logger_1.logger.error(`Failed to create document in ${__classPrivateFieldGet(this, _BaseRepository_model, "f").modelName}: ${err.message}`);
            throw new RepositoryError(`Failed to create document: ${err.message}`);
        }
    }
    async findById(id) {
        try {
            const item = await __classPrivateFieldGet(this, _BaseRepository_model, "f").findById(id).exec();
            return item;
        }
        catch (err) {
            logger_1.logger.error(`Failed to find document in ${__classPrivateFieldGet(this, _BaseRepository_model, "f").modelName} by ID ${id}: ${err.message}`);
            throw new RepositoryError(`Failed to find document: ${err.message}`);
        }
    }
    async findOne(filter) {
        try {
            const item = await __classPrivateFieldGet(this, _BaseRepository_model, "f").findOne(filter).exec();
            logger_1.logger.debug(`Queried ${__classPrivateFieldGet(this, _BaseRepository_model, "f").modelName} with filter ${JSON.stringify(filter)}: ${item ? 'found' : 'not found'}`);
            return item;
        }
        catch (err) {
            logger_1.logger.error(`Failed to find document in ${__classPrivateFieldGet(this, _BaseRepository_model, "f").modelName}: ${err.message}`);
            throw new RepositoryError(`Failed to find document: ${err.message}`);
        }
    }
    async findByEmail(email) {
        try {
            const item = await __classPrivateFieldGet(this, _BaseRepository_model, "f").findOne({ email }).exec();
            return item;
        }
        catch (err) {
            logger_1.logger.error(`Failed to find document in ${__classPrivateFieldGet(this, _BaseRepository_model, "f").modelName}: ${err.message}`);
            throw new RepositoryError(`Failed to find document: ${err.message}`);
        }
    }
    async findAll(filter = {}, options = {}) {
        try {
            const items = await __classPrivateFieldGet(this, _BaseRepository_model, "f").find(filter, null, options).exec();
            logger_1.logger.debug(`Found ${items.length} documents in ${__classPrivateFieldGet(this, _BaseRepository_model, "f").modelName} with filter ${JSON.stringify(filter)}`);
            return items;
        }
        catch (err) {
            logger_1.logger.error(`Failed to find documents in ${__classPrivateFieldGet(this, _BaseRepository_model, "f").modelName}: ${err.message}`);
            throw new RepositoryError(`Failed to find documents: ${err.message}`);
        }
    }
    async update(id, data) {
        try {
            const item = await __classPrivateFieldGet(this, _BaseRepository_model, "f").findByIdAndUpdate(id, data, { new: true }).exec();
            logger_1.logger.info(`Updated document in ${__classPrivateFieldGet(this, _BaseRepository_model, "f").modelName} with ID ${id}: ${item ? 'success' : 'not found'}`);
            return item;
        }
        catch (err) {
            logger_1.logger.error(`Failed to update document in ${__classPrivateFieldGet(this, _BaseRepository_model, "f").modelName} with ID ${id}: ${err.message}`);
            throw new RepositoryError(`Failed to update document: ${err.message}`);
        }
    }
    async countDocuments() {
        try {
            const count = await __classPrivateFieldGet(this, _BaseRepository_model, "f").countDocuments();
            return count;
        }
        catch (error) {
            logger_1.logger.error(`count the documents: ${error.message}`);
            throw new RepositoryError(`Failed to count document: ${error.message}`);
        }
    }
}
exports.BaseRepository = BaseRepository;
_BaseRepository_model = new WeakMap();
