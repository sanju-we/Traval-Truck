"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSubscriptionService = void 0;
const inversify_1 = require("inversify");
const subscription_dto_1 = require("../../core/DTO/subscription.dto");
const resAndErrors_1 = require("../../utils/resAndErrors");
const logger_1 = require("../../utils/logger");
let AdminSubscriptionService = class AdminSubscriptionService {
    constructor(_adminSubscriptionRepo, _subscriptionValidator) {
        this._adminSubscriptionRepo = _adminSubscriptionRepo;
        this._subscriptionValidator = _subscriptionValidator;
    }
    async addSub(data) {
        await this._subscriptionValidator.addSubscriptionValidator(data.Name, data.Amount, data.Category, data.Description, data.Duration, data.Features, data.Valid);
        const value = {
            Name: data.Name,
            Duration: {
                startingDate: new Date(data.Duration.startingDate),
                endingDate: new Date(data.Duration.endingDate),
            },
            Description: data.Description,
            Amount: data.Amount,
            Features: data.Features,
            Category: data.Category,
            Valid: data.Valid,
        };
        const created = await this._adminSubscriptionRepo.create(value);
        logger_1.logger.info('data from the service', created);
        if (created)
            return (0, subscription_dto_1.toSubdcriptionDTO)(created);
        throw new resAndErrors_1.UserNotFoundError();
    }
    async getAllSubscriptions() {
        const datas = await this._adminSubscriptionRepo.findAll({}, {});
        logger_1.logger.info('data comming from the repository is ', datas);
        if (datas)
            return datas.map(subscription_dto_1.toSubdcriptionDTO);
        throw new resAndErrors_1.UserNotFoundError();
    }
    async editSubscription(data, id) {
        await this._subscriptionValidator.addSubscriptionValidator(data.Name, data.Amount, data.Category, data.Description, data.Duration, data.Features, data.Valid);
        const value = {
            Name: data.Name,
            Duration: {
                startingDate: new Date(data.Duration.startingDate),
                endingDate: new Date(data.Duration.endingDate),
            },
            Description: data.Description,
            Amount: data.Amount,
            Features: data.Features,
            Category: data.Category,
            Valid: data.Valid,
        };
        const update = await this._adminSubscriptionRepo.update(id, value);
        if (update)
            return (0, subscription_dto_1.toSubdcriptionDTO)(update);
        throw new resAndErrors_1.UserNotFoundError();
    }
    async tonggleStatusService(id) {
        const data = await this._adminSubscriptionRepo.findById(id);
        if (!data)
            throw new resAndErrors_1.InvalidAction();
        const update = await this._adminSubscriptionRepo.update(id, { IsActive: !data.IsActive });
        if (!update)
            throw new resAndErrors_1.InvalidAction();
        return (0, subscription_dto_1.toSubdcriptionDTO)(update);
    }
};
exports.AdminSubscriptionService = AdminSubscriptionService;
exports.AdminSubscriptionService = AdminSubscriptionService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('ISubscriptionRepository')),
    __param(1, (0, inversify_1.inject)('ISubscriptionValidator')),
    __metadata("design:paramtypes", [Object, Object])
], AdminSubscriptionService);
