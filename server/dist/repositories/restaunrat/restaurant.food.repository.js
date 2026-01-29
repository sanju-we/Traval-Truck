"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantFoodRepository = void 0;
const baseRepository_1 = require("../../repositories/baseRepository");
const Foods_1 = __importDefault(require("../../models/Foods"));
const requestDTO_1 = require("../../core/DTO/restaurant/requestDTO");
class RestaurantFoodRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(Foods_1.default);
    }
    async findAllFoodsWithPartners(page, lim, search) {
        const limit = lim || 6;
        const skip = (page - 1) * limit;
        const searchFilter = search
            ? { Name: { $regex: search, $options: 'i' } }
            : {};
        const [packages, total] = await Promise.all([
            // .populate('RestaurantId')
            Foods_1.default.find(searchFilter)
                .skip(skip)
                .limit(limit)
                .lean(),
            Foods_1.default.countDocuments()
        ]);
        // if (!packages.length) throw new Data_Creation_Error();
        return {
            data: packages.map(requestDTO_1.toFoodDTO),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
}
exports.RestaurantFoodRepository = RestaurantFoodRepository;
