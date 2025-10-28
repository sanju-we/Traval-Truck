export const toSubdcriptionDTO = (subscription) => ({
    id: subscription._id.toString(),
    name: subscription.Name,
    category: subscription.Category,
    duration: subscription.Duration,
    valid: subscription.Valid,
    description: subscription.Description,
    amount: subscription.Amount,
    features: subscription.Features,
    isActive: subscription.IsActive,
});
