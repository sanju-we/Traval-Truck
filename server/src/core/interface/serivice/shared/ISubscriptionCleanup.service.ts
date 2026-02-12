export interface ISubscriptionCleanupService {
    checkAndExpireSubscriptions(): Promise<void>;
}
