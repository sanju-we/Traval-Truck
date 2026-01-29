"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMindMapRes = void 0;
const toMindMapRes = (mindMap) => ({
    id: mindMap._id.toString(),
    orderId: mindMap.orderId,
    title: mindMap.title,
    places: mindMap.places,
    aiInsights: mindMap.aiInsights,
    plan: mindMap.plan,
    partners: mindMap.partners,
    startDate: mindMap.startDate,
    endDate: mindMap.endDate,
    startingPosition: mindMap.startingPosition,
    routeMetrics: mindMap.routeMetrics,
    budget: mindMap.budget,
    status: mindMap.status,
    isPublic: mindMap.isPublic,
    tripProgress: mindMap.tripProgress,
    createdAt: mindMap.createdAt,
    updateAt: mindMap.updatedAt
});
exports.toMindMapRes = toMindMapRes;
