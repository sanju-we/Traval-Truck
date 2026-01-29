"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shared_wallet_routes_1 = __importDefault(require("./sharedRoute/shared.wallet.routes"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const shared_payment_routes_1 = __importDefault(require("./sharedRoute/shared.payment.routes"));
const shared_subscription_routes_1 = __importDefault(require("./sharedRoute/shared.subscription.routes"));
const shared_review_routes_1 = __importDefault(require("./sharedRoute/shared.review.routes"));
const sharedRouter = (0, express_1.Router)();
sharedRouter.use('/wallet/:role', authMiddleware_1.checkRole, shared_wallet_routes_1.default)
    .use('/payments/:role', authMiddleware_1.checkRole, shared_payment_routes_1.default)
    .use('/subscriptions/:role', authMiddleware_1.checkRole, shared_subscription_routes_1.default)
    .use('/review/:role', authMiddleware_1.checkRole, shared_review_routes_1.default);
exports.default = sharedRouter;
