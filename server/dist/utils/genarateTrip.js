"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripGenerator = void 0;
class TripGenerator {
    async generatePlanFromItinerary(itineray, date) {
        const plan = [];
        for (let item of itineray) {
            const day = new Date(date);
            date.setDate(date.getDate() + item.day - 1);
            plan.push({
                date: day,
                day: item.day,
                title: item.title,
                activities: item.activities,
                completedActivities: [],
                isCompleted: false
            });
        }
        return plan;
    }
}
exports.TripGenerator = TripGenerator;
