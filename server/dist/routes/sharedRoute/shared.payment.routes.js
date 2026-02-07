"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const paymentRouter = express_1.default.Router();
const paymentController = container_1.container.get('IPaymentController');
const webhook = container_1.container.get('IWebhookController');
paymentRouter.post('/create-payment', (0, asyncHandler_1.asyncHandler)(paymentController.initiate.bind(paymentController)))
    .post('/webhook', express_1.default.raw({ type: "application/json" }), (0, asyncHandler_1.asyncHandler)(webhook.webHookHandler.bind(webhook)));
exports.default = paymentRouter;
