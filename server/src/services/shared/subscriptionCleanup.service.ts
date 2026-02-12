import { inject, injectable } from "inversify";
import { ISubscriptionCleanupService } from "../../core/interface/serivice/shared/ISubscriptionCleanup.service";
import { ISubscriptionHistoryRepository } from "../../core/interface/repositorie/shared/ISubscription.hisroty.repository";
import { logger } from "../../utils/logger";

@injectable()
export class SubscriptionCleanupService implements ISubscriptionCleanupService {
    constructor(
        @inject("ISubscriptionHistoryRepository")
        private readonly _subscriptionHistoryRepo: ISubscriptionHistoryRepository
    ) { }

    async checkAndExpireSubscriptions(): Promise<void> {
        try {
            logger.info("Running subscription expiration check...");
            const now = new Date();

            const result = await this._subscriptionHistoryRepo.updateMany(
                {
                    status: "active",
                    endDate: { $lt: now }
                },
                {
                    $set: { status: "expired" }
                }
            );

            if (result.modifiedCount > 0) {
                logger.info(`Successfully expired ${result.modifiedCount} subscriptions.`);
            } else {
                logger.debug("No subscriptions to expire.");
            }
        } catch (error: any) {
            logger.error(`Error in subscription expiration check: ${error.message}`);
        }
    }
}
