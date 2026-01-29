"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionHistoryRepository = void 0;
const baseRepository_1 = require("../../repositories/baseRepository");
const SubscriptionHistory_1 = __importDefault(require("../../models/SubscriptionHistory"));
class subscriptionHistoryRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(SubscriptionHistory_1.default);
    }
}
exports.subscriptionHistoryRepository = subscriptionHistoryRepository;
