"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const inversify_1 = require("inversify");
const logger_1 = require("../../utils/logger");
const cron = __importStar(require("node-cron"));
let SchedulerService = class SchedulerService {
    constructor(_cleanupService) {
        this._cleanupService = _cleanupService;
        this._task = null;
    }
    start() {
        if (this._task) {
            logger_1.logger.warn("Scheduler is already running.");
            return;
        }
        logger_1.logger.info("Initializing Subscription Expiration Scheduler (Cron Job)...");
        // Run once immediately on start
        this._cleanupService.checkAndExpireSubscriptions();
        // Schedule cron job to run every hour at minute 0
        // Expression: '0 * * * *' (Minute, Hour, Day of Month, Month, Day of Week)
        this._task = cron.schedule("0 * * * *", () => {
            logger_1.logger.info("Triggering scheduled subscription check...");
            this._cleanupService.checkAndExpireSubscriptions();
        });
        logger_1.logger.info(`Scheduler started. Cron pattern: '0 * * * *' (Every hour)`);
    }
    stop() {
        if (this._task) {
            this._task.stop();
            this._task = null;
            logger_1.logger.info("Scheduler stopped.");
        }
    }
};
exports.SchedulerService = SchedulerService;
exports.SchedulerService = SchedulerService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)("ISubscriptionCleanupService")),
    __metadata("design:paramtypes", [Object])
], SchedulerService);
