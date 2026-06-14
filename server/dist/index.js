"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const app_1 = require("./app");
const logger_1 = require("./utils/logger");
const container_1 = require("./core/DI/container");
const http_1 = __importDefault(require("http"));
dotenv_1.default.config();
const app = (0, app_1.createApp)();
const server = http_1.default.createServer(app);
const port = process.env.PORT || 5000;
(0, db_1.connectDB)().then(() => {
    const scheduler = container_1.container.get('SchedulerService');
    scheduler.start();
    const socketService = container_1.container.get('SocketService');
    socketService.init(server);
    server.listen(port, () => logger_1.logger.info(`Server running on http://localhost:${port}`));
});
