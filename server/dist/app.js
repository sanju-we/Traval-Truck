"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const userRouters_1 = __importDefault(require("./routes/userRouters"));
const adminRouters_1 = __importDefault(require("./routes/adminRouters"));
const agencyRouters_1 = __importDefault(require("./routes/agencyRouters"));
const hotelRouters_1 = __importDefault(require("./routes/hotelRouters"));
const restaurant_1 = __importDefault(require("./routes/restaurant"));
const sharedRouter_1 = __importDefault(require("./routes/sharedRouter"));
const chatRouter_1 = __importDefault(require("./routes/chatRouter"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandler_1 = require("./middleware/errorHandler");
const container_1 = require("./core/DI/container");
const app = (0, express_1.default)();
// middle wares
const originAllowed = ['http://localhost:3000', 'http://localhost:3001', 'https://ba6c408cccf9.ngrok-free.app'];
app.use((0, cors_1.default)({
    origin: originAllowed,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
// app.options('*', cors());
const webhook = container_1.container.get('IWebhookController');
app.post("/api/webhook/stripe", express_1.default.raw({ type: "application/json" }), webhook.webHookHandler.bind(webhook));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use('/api/user', userRouters_1.default);
app.use('/api/admin', adminRouters_1.default);
app.use('/api/agency', agencyRouters_1.default);
app.use('/api/hotel', hotelRouters_1.default);
app.use('/api/restaurant', restaurant_1.default);
app.use('/api/shared', sharedRouter_1.default);
app.use('/api/chat', chatRouter_1.default);
// error handling middleware
app.use(errorHandler_1.errorHandler);
function createApp() {
    return app;
}
