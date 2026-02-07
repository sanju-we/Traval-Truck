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
exports.userFoodsService = void 0;
const inversify_1 = require("inversify");
const resAndErrors_1 = require("../../utils/resAndErrors");
let userFoodsService = class userFoodsService {
    constructor(_foodRepository, _subscriptionHistoryRepo) {
        this._foodRepository = _foodRepository;
        this._subscriptionHistoryRepo = _subscriptionHistoryRepo;
    }
    async getAllRooms(page, limit, search) {
        const data = await this._foodRepository.findAllFoodsWithPartners(page, limit, search);
        const checks = await Promise.all(data.data.map(async (food) => {
            const subscription = await this._subscriptionHistoryRepo.findOne({
                userId: food.restaurant,
            });
            return subscription ? food : null;
        }));
        const result = checks.filter((food) => food !== null);
        data.data = result;
        if (data)
            return data;
        throw new resAndErrors_1.DataNotFoundError();
    }
};
exports.userFoodsService = userFoodsService;
exports.userFoodsService = userFoodsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IRestaurantFoodRespository')),
    __param(1, (0, inversify_1.inject)('ISubscriptionHistoryRepository')),
    __metadata("design:paramtypes", [Object, Object])
], userFoodsService);
