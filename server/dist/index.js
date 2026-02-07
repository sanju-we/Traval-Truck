"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const app_1 = require("./app");
const logger_1 = require("./utils/logger");
dotenv_1.default.config();
const app = (0, app_1.createApp)();
const port = process.env.PORT || 5000;
(0, db_1.connectDB)().then(() => {
    app.listen(port, () => logger_1.logger.info(`Server running on http://localhost:${port}`));
});
