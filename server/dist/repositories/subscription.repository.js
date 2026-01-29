"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRepository = void 0;
const baseRepository_1 = require("../repositories/baseRepository");
const Subscription_1 = __importDefault(require("../models/Subscription"));
class SubscriptionRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(Subscription_1.default);
    }
}
exports.SubscriptionRepository = SubscriptionRepository;
