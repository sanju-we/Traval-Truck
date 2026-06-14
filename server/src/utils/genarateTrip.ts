import { TripPlan } from "../types/index";
import { IPackage } from "../core/interface/modelInterface/Ipackage";
import { IGenerateTrip } from "../core/interface/utils/Igenerate.trip";

export class TripGenerator implements IGenerateTrip {
  async generatePlanFromItinerary(itineray: IPackage["itinerary"], date: Date): Promise<TripPlan[]> {
    const plan: TripPlan[] = []

    for (const item of itineray) {
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