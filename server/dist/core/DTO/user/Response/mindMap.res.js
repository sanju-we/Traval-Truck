export const toMindMapRes = (mindMap) => ({
    orderId: mindMap.orderId,
    title: mindMap.title,
    places: mindMap.places,
    plan: mindMap.plan,
    startDate: mindMap.startDate,
    endDate: mindMap.endDate,
    startingPosition: mindMap.startingPosition,
    status: mindMap.status,
    isPublic: mindMap.isPublic,
    tripProgress: mindMap.tripProgress,
    createdAt: mindMap.createdAt
});
