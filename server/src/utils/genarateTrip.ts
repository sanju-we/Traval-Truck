import { TripPlan } from "../types/index.js";
import { IPackage } from "../core/interface/modelInterface/Ipackage.js";
import { IGenerateTrip } from "../core/interface/utils/Igenerate.trip.js";

export class TripGenerator implements IGenerateTrip {
  async generatePlanFromItinerary(itineray: IPackage["itinerary"], date: Date): Promise<TripPlan[]> {
    const plan: TripPlan[] = []

    for (let item of itineray) {
      const day = new Date(date)
      date.setDate(date.getDate() + item.day - 1)
      plan.push({
        date: day,
        day: item.day,
        title: item.title,
        activities: item.activities,
        completedActivities: [],
        isCompleted: false
      })
    }

    return plan
  }
}