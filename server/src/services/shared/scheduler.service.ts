import { inject, injectable } from "inversify";
import { ISubscriptionCleanupService } from "../../core/interface/serivice/shared/ISubscriptionCleanup.service";
import { logger } from "../../utils/logger";
import * as cron from "node-cron";

@injectable()
export class SchedulerService {
    private _task: cron.ScheduledTask | null = null;

    constructor(
        @inject("ISubscriptionCleanupService")
        private readonly _cleanupService: ISubscriptionCleanupService
    ) { }

    start(): void {
        if (this._task) {
            logger.warn("Scheduler is already running.");
            return;
        }

        logger.info("Initializing Subscription Expiration Scheduler (Cron Job)...");

        // Run once immediately on start
        this._cleanupService.checkAndExpireSubscriptions();

        // Schedule cron job to run every hour at minute 0
        // Expression: '0 * * * *' (Minute, Hour, Day of Month, Month, Day of Week)
        this._task = cron.schedule("0 * * * *", () => {
            logger.info("Triggering scheduled subscription check...");
            this._cleanupService.checkAndExpireSubscriptions();
        });

        logger.info(`Scheduler started. Cron pattern: '0 * * * *' (Every hour)`);
    }

    stop(): void {
        if (this._task) {
            this._task.stop();
            this._task = null;
            logger.info("Scheduler stopped.");
        }
    }
}
